import { CanceledError } from "axios";
import { create } from "zustand";
import {
	parseAccessToken,
	type SessionUser,
} from "@/features/auth/utils/tokenUtils";

export const ACCESS_TOKEN_KEY = "jwt-access-token";
export interface SessionState {
	token: string | null;
	user: SessionUser | null;
	expiresAt: number;
	revision: number;
	epoch: number;
	status: "signedOut" | "authenticating" | "recovering" | "authenticated";
}

export const useSessionStore = create<SessionState>(() => ({
	token: null,
	user: null,
	expiresAt: 0,
	revision: 0,
	epoch: 0,
	status: "signedOut",
}));
let controller = new AbortController();
export const getSession = useSessionStore.getState;
export const getSessionSignal = () => controller.signal;
export const assertSession = (epoch: number) => {
	if (getSession().epoch !== epoch) throw new CanceledError("Session changed");
};

// Advance the generation before notifying consumers or aborting old work.
const replaceSession = (state: Omit<SessionState, "epoch">) => {
	const previous = controller;
	controller = new AbortController();
	useSessionStore.setState({ ...state, epoch: getSession().epoch + 1 });
	previous.abort();
	return getSession().epoch;
};

export const endSession = () => {
	localStorage.removeItem(ACCESS_TOKEN_KEY);
	replaceSession({
		token: null,
		user: null,
		expiresAt: 0,
		revision: 0,
		status: "signedOut",
	});
};
export const beginLogin = () => {
	localStorage.removeItem(ACCESS_TOKEN_KEY);
	return replaceSession({
		token: null,
		user: null,
		expiresAt: 0,
		revision: 0,
		status: "authenticating",
	});
};
export const commitLogin = (token: string, epoch: number) => {
	assertSession(epoch);
	const claims = parseAccessToken(token);
	if (!claims) throw new Error("Invalid access token");
	localStorage.setItem(ACCESS_TOKEN_KEY, token);
	useSessionStore.setState({
		token,
		...claims,
		revision: getSession().revision + 1,
		status: "authenticated",
	});
	assertSession(epoch);
	return claims.user;
};
export const replaceAccessToken = (token: string) => {
	const epoch = beginLogin();
	try {
		commitLogin(token, epoch);
	} catch (error) {
		if (getSession().epoch === epoch) endSession();
		throw error;
	}
};
export const markRecovering = (epoch: number) => {
	assertSession(epoch);
	useSessionStore.setState({ status: "recovering" });
};
export const commitRefresh = (token: string, epoch: number) => {
	assertSession(epoch);
	const claims = parseAccessToken(token);
	if (!claims || claims.user.id !== getSession().user?.id)
		throw new Error("Refresh changed identity");
	localStorage.setItem(ACCESS_TOKEN_KEY, token);
	useSessionStore.setState({
		token,
		...claims,
		revision: getSession().revision + 1,
		status: "authenticated",
	});
};
export const initializeSession = () => {
	const token = localStorage.getItem(ACCESS_TOKEN_KEY);
	const claims = parseAccessToken(token, true);
	if (!token || !claims) {
		endSession();
		return;
	}
	replaceSession({
		token,
		...claims,
		revision: 0,
		status: claims.expiresAt > Date.now() ? "authenticated" : "recovering",
	});
};
