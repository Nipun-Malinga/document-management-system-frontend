import { QueryClient } from "@tanstack/react-query";
import {
	type AxiosAdapter,
	AxiosError,
	type InternalAxiosRequestConfig,
} from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import APIService, {
	axiosInstance,
	refreshSession,
} from "@/services/apiService";
import { bindSessionQueryClient, login } from "@/services/sessionService";
import {
	endSession,
	getSession,
	initializeSession,
	replaceAccessToken,
	useSessionStore,
} from "@/states/sessionStore";
import { claims, tokenFor } from "../fixtures";

const originalAdapter = axiosInstance.defaults.adapter;
const refreshed = () =>
	tokenFor({ ...claims, exp: Math.floor(Date.now() / 1000) + 7200 });
const response = (config: InternalAxiosRequestConfig, data: unknown = {}) => ({
	data,
	status: 200,
	statusText: "OK",
	headers: {},
	config,
});
const failure = (config: InternalAxiosRequestConfig, status = 401) =>
	new AxiosError("Rejected", "ERR_BAD_REQUEST", config, undefined, {
		...response(config),
		status,
	});
const deferred = <T>() => {
	let resolve!: (value: T) => void;
	const promise = new Promise<T>((done) => {
		resolve = done;
	});
	return { promise, resolve };
};
beforeEach(() => replaceAccessToken(tokenFor()));
afterEach(() => {
	axiosInstance.defaults.adapter = originalAdapter;
	vi.restoreAllMocks();
});

describe("session-scoped REST refresh", () => {
	it("refreshes simultaneous 401s once and retries each with the new bearer", async () => {
		const gate = deferred<void>();
		const adapter = vi.fn<AxiosAdapter>(async (config) => {
			if (config.url === "/auth/refresh") {
				await gate.promise;
				return response(config, { token: refreshed() });
			}
			if (!config.sessionRetried) throw failure(config);
			return response(config, config.headers.get("Authorization"));
		});
		axiosInstance.defaults.adapter = adapter;
		const first = new APIService("/one").get();
		const second = new APIService("/two").get();
		await vi.waitFor(() =>
			expect(
				adapter.mock.calls.filter(([c]) => c.url === "/auth/refresh"),
			).toHaveLength(1),
		);
		expect(getSession().status).toBe("recovering");
		gate.resolve();
		expect(await first).toBe(`Bearer ${refreshed()}`);
		expect(await second).toBe(`Bearer ${refreshed()}`);
		expect(adapter).toHaveBeenCalledTimes(5);
	});

	it("does not refresh twice for a delayed 401 even when refresh returned identical token text", async () => {
		const gate = deferred<void>();
		const adapter = vi.fn<AxiosAdapter>(async (config) => {
			if (config.url === "/auth/refresh")
				return response(config, { token: tokenFor() });
			if (config.url === "/late" && !config.sessionRetried) await gate.promise;
			if (!config.sessionRetried) throw failure(config);
			return response(config);
		});
		axiosInstance.defaults.adapter = adapter;
		const late = new APIService("/late").get();
		await new APIService("/first").get();
		gate.resolve();
		await late;
		expect(
			adapter.mock.calls.filter(([c]) => c.url === "/auth/refresh"),
		).toHaveLength(1);
	});

	it.each(["/auth/login", "/auth/refresh", "/users/register"])(
		"never retries the public POST %s or sends its bearer",
		async (path) => {
			const adapter = vi.fn<AxiosAdapter>(async (config) => {
				throw failure(config);
			});
			axiosInstance.defaults.adapter = adapter;
			await expect(new APIService(path).post()).rejects.toBeInstanceOf(
				AxiosError,
			);
			expect(adapter).toHaveBeenCalledTimes(1);
			const config = adapter.mock.calls[0][0];
			expect(config.headers.get("Authorization")).toBeUndefined();
			if (path !== "/users/register") expect(config.withCredentials).toBe(true);
			expect(getSession().status).toBe("authenticated");
		},
	);

	it("does not retry a protected 403 or log out", async () => {
		const adapter = vi.fn<AxiosAdapter>(async (config) => {
			throw failure(config, 403);
		});
		axiosInstance.defaults.adapter = adapter;
		await expect(new APIService("/denied").get()).rejects.toMatchObject({
			response: { status: 403 },
		});
		expect(adapter).toHaveBeenCalledTimes(1);
		expect(getSession().status).toBe("authenticated");
	});

	it("stops after the retried 401 and terminates the session", async () => {
		const adapter = vi.fn<AxiosAdapter>(async (config) => {
			if (config.url === "/auth/refresh")
				return response(config, { token: refreshed() });
			throw failure(config);
		});
		axiosInstance.defaults.adapter = adapter;
		await expect(new APIService("/denied").get()).rejects.toBeInstanceOf(
			AxiosError,
		);
		expect(adapter).toHaveBeenCalledTimes(3);
		expect(getSession().status).toBe("signedOut");
	});

	it("recovers an expired stored token before a protected request", async () => {
		localStorage.setItem("jwt-access-token", tokenFor({ ...claims, exp: 1 }));
		initializeSession();
		const adapter = vi.fn<AxiosAdapter>(async (config) =>
			response(
				config,
				config.url === "/auth/refresh" ? { token: refreshed() } : {},
			),
		);
		axiosInstance.defaults.adapter = adapter;
		await new APIService("/protected").get();
		expect(adapter.mock.calls.map(([c]) => c.url)).toEqual([
			"/auth/refresh",
			"/protected",
		]);
		expect(getSession().status).toBe("authenticated");
	});

	it("does not recover a missing token", async () => {
		endSession();
		const adapter = vi.fn<AxiosAdapter>();
		axiosInstance.defaults.adapter = adapter;
		await expect(new APIService("/protected").get()).rejects.toMatchObject({
			code: "ERR_CANCELED",
		});
		expect(adapter).not.toHaveBeenCalled();
	});

	it.each(["failure", "invalid", "other-user"])(
		"terminates recovery after %s",
		async (mode) => {
			axiosInstance.defaults.adapter = async (config) => {
				if (mode === "failure") throw failure(config);
				return response(config, {
					token:
						mode === "invalid" ? "invalid" : tokenFor({ ...claims, sub: "2" }),
				});
			};
			await expect(refreshSession()).rejects.toBeDefined();
			expect(getSession().status).toBe("signedOut");
			expect(localStorage.getItem("jwt-access-token")).toBeNull();
		},
	);

	it("logout wins a pending refresh without restoring credentials", async () => {
		const gate = deferred<void>();
		const adapter = vi.fn<AxiosAdapter>(async (config) => {
			await gate.promise;
			return response(config, { token: refreshed() });
		});
		axiosInstance.defaults.adapter = adapter;
		const pending = refreshSession();
		const rejected = expect(pending).rejects.toMatchObject({
			code: "ERR_CANCELED",
		});
		await vi.waitFor(() => expect(adapter).toHaveBeenCalledTimes(1));
		endSession();
		gate.resolve();
		await rejected;
		expect(getSession().status).toBe("signedOut");
	});

	it("account switching rejects old completions, aborts requests and clears caches", async () => {
		const client = new QueryClient();
		const unbind = bindSessionQueryClient(client);
		client.setQueryData(["private"], "Account A");
		const gate = deferred<void>();
		const adapter = vi.fn<AxiosAdapter>(async (config) => {
			await gate.promise;
			return response(config, "Account A");
		});
		axiosInstance.defaults.adapter = adapter;
		const oldService = new APIService("/private");
		const pending = oldService.get();
		const rejected = expect(pending).rejects.toMatchObject({
			code: "ERR_CANCELED",
		});
		await vi.waitFor(() => expect(adapter).toHaveBeenCalled());
		replaceAccessToken(
			tokenFor({ ...claims, sub: "2", username: "account-b" }),
		);
		expect(adapter.mock.calls[0][0].signal?.aborted).toBe(true);
		expect(client.getQueryData(["private"])).toBeUndefined();
		gate.resolve();
		await rejected;
		await expect(oldService.get()).rejects.toMatchObject({
			code: "ERR_CANCELED",
		});
		expect(getSession().user?.id).toBe(2);
		expect(client.getQueryData(["private"])).toBeUndefined();
		unbind();
		client.clear();
	});

	it("cancelled login cannot replace a newer account and credentialed login has no old bearer", async () => {
		const gate = deferred<void>();
		const adapter = vi.fn<AxiosAdapter>(async (config) => {
			await gate.promise;
			return response(config, { token: tokenFor() });
		});
		axiosInstance.defaults.adapter = adapter;
		const pending = login({ email: "owner@example.com", password: "password" });
		const rejected = expect(pending).rejects.toMatchObject({
			code: "ERR_CANCELED",
		});
		await vi.waitFor(() => expect(adapter).toHaveBeenCalled());
		expect(adapter.mock.calls[0][0].withCredentials).toBe(true);
		expect(
			adapter.mock.calls[0][0].headers.get("Authorization"),
		).toBeUndefined();
		replaceAccessToken(tokenFor({ ...claims, sub: "2" }));
		gate.resolve();
		await rejected;
		expect(getSession().user?.id).toBe(2);
	});
});

it("logout also wins at the instant refreshed credentials are installed", async () => {
	replaceAccessToken(tokenFor());
	axiosInstance.defaults.adapter = async (config) =>
		response(config, { token: refreshed() });
	const unsubscribe = useSessionStore.subscribe((state, previous) => {
		if (state.status === "authenticated" && previous.status === "recovering")
			endSession();
	});
	await expect(refreshSession()).rejects.toMatchObject({
		code: "ERR_CANCELED",
	});
	expect(getSession().status).toBe("signedOut");
	unsubscribe();
});
