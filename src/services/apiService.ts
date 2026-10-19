import axios, {
	type AxiosRequestConfig,
	type InternalAxiosRequestConfig,
} from "axios";
import type { SignInResponse } from "@/features/auth/schemas/SignIn";
import {
	assertSession,
	commitRefresh,
	endSession,
	getSession,
	getSessionSignal,
	markRecovering,
} from "@/features/auth/stores/sessionStore";
import type { ProblemDetail } from "@/shared/types/ProblemDetail";

// Metadata follows the original request through its single authorized retry.
declare module "axios" {
	interface AxiosRequestConfig {
		sessionEpoch?: number;
		sessionToken?: string | null;
		sessionRevision?: number;
		sessionRetried?: boolean;
	}
}

export const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_SERVER_URL,
});
const isPublic = (config: AxiosRequestConfig) =>
	config.method?.toLowerCase() === "post" &&
	["/auth/login", "/auth/refresh", "/users/register"].includes(
		config.url ?? "",
	);

let recovery: { epoch: number; promise: Promise<string> } | null = null;
export const refreshSession = (epoch = getSession().epoch): Promise<string> => {
	assertSession(epoch);
	if (recovery?.epoch === epoch) return recovery.promise;
	if (!getSession().token || !getSession().user)
		return Promise.reject(new axios.CanceledError("No session to recover"));
	// Defer execution so callers notified by markRecovering share this promise too.
	const promise = Promise.resolve()
		.then(async () => {
			try {
				assertSession(epoch);
				const response = await new APIService<undefined, SignInResponse>(
					"/auth/refresh",
				).post(undefined, { timeout: 15000 });
				commitRefresh(response.token, epoch);
				assertSession(epoch);
				return response.token;
			} catch (error) {
				if (getSession().epoch === epoch) endSession();
				throw error;
			}
		})
		.finally(() => {
			if (recovery?.promise === promise) recovery = null;
		});
	recovery = { epoch, promise };
	markRecovering(epoch);
	return promise;
};

export const ensureAccessToken = async (epoch = getSession().epoch) => {
	assertSession(epoch);
	const session = getSession();
	if (!session.token || !session.user)
		throw new axios.CanceledError("Sign in required");
	if (session.status === "recovering" || session.expiresAt <= Date.now())
		await refreshSession(epoch);
	assertSession(epoch);
	const token = getSession().token;
	if (!token) throw new axios.CanceledError("Sign in required");
	return token;
};

axiosInstance.interceptors.request.use(
	async (config: InternalAxiosRequestConfig) => {
		const epoch = config.sessionEpoch ?? getSession().epoch;
		config.sessionEpoch = epoch;
		assertSession(epoch);
		if (isPublic(config)) {
			config.headers.delete("Authorization");
			if (config.url === "/auth/login" || config.url === "/auth/refresh")
				config.withCredentials = true;
		} else {
			config.sessionToken = await ensureAccessToken(epoch);
			config.sessionRevision = getSession().revision;
			config.headers.set("Authorization", `Bearer ${config.sessionToken}`);
		}
		assertSession(epoch);
		return config;
	},
);
axiosInstance.interceptors.response.use(
	(response) => {
		const epoch = response.config.sessionEpoch;
		if (epoch === undefined)
			throw new axios.CanceledError("Request session is missing");
		assertSession(epoch);
		return response;
	},
	async (error: unknown) => {
		if (!axios.isAxiosError(error) || !error.config) throw error;
		const config = error.config;
		const epoch = config.sessionEpoch;
		if (epoch === undefined) throw error;
		assertSession(epoch);
		if (error.response?.status !== 401 || isPublic(config)) throw error;

		if (
			config.method?.toLowerCase() === "put" &&
			config.url === "/users/me/password" &&
			(error.response?.data as ProblemDetail | undefined)?.detail ===
				"Invalid credentials."
		)
			throw error;
		if (config.sessionRetried) {
			endSession();
			throw error;
		}
		config.sessionRetried = true;
		// A delayed 401 from an old token must not start a second refresh.
		if (
			getSession().revision === config.sessionRevision ||
			getSession().status === "recovering"
		)
			await refreshSession(epoch);
		assertSession(epoch);
		return axiosInstance.request(config);
	},
);

class APIService<T, K = T> {
	private endpoint: string;
	private epoch: number;
	constructor(endpoint: string) {
		this.endpoint = endpoint;
		this.epoch = getSession().epoch;
	}

	private async request(
		method: string,
		data?: T,
		config?: AxiosRequestConfig,
	): Promise<K> {
		assertSession(this.epoch);
		const controller = new AbortController();
		const signals = [getSessionSignal(), config?.signal].filter(
			(signal) => signal !== undefined,
		);
		const abort = () => controller.abort();
		for (const signal of signals) {
			if (signal.aborted) abort();
			else signal.addEventListener?.("abort", abort);
		}
		try {
			const response = await axiosInstance.request<K>({
				...config,
				method,
				url: this.endpoint,
				data,
				signal: controller.signal,
				sessionEpoch: this.epoch,
			});
			assertSession(this.epoch);
			return response.data;
		} finally {
			for (const signal of signals)
				signal.removeEventListener?.("abort", abort);
		}
	}
	public get(config?: AxiosRequestConfig) {
		return this.request("get", undefined, config);
	}
	public post(data?: T, config?: AxiosRequestConfig) {
		return this.request("post", data, config);
	}
	public put(data?: T, config?: AxiosRequestConfig) {
		return this.request("put", data, config);
	}
	public delete(config?: AxiosRequestConfig) {
		return this.request("delete", undefined, config);
	}
}
export default APIService;
