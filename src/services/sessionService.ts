import type { QueryClient } from "@tanstack/react-query";
import {
	ACCESS_TOKEN_KEY,
	assertSession,
	beginLogin,
	commitLogin,
	commitRefresh,
	endSession,
	getSession,
	initializeSession,
	useSessionStore,
} from "@/states/sessionStore";
import useAutoSave from "@/states/useAutoSave";
import useDocumentBranch from "@/states/useDocumentBranch";
import useDocumentInfoPopUp from "@/states/useDocumentInfoPopup";
import useEditorTemplate from "@/states/useEditorTemplate";
import useUserProfilePopup from "@/states/useUserProfilePopup";
import type { SignInRequest, SignInResponse } from "@/types/SignIn";
import { parseAccessToken } from "@/utils/tokenUtils";
import APIService, { ensureAccessToken, refreshSession } from "./apiService";

export const login = async (data: SignInRequest) => {
	const epoch = beginLogin();
	try {
		const response = await new APIService<SignInRequest, SignInResponse>(
			"/auth/login",
		).post(data);
		assertSession(epoch);
		commitLogin(response.token, epoch);
		assertSession(epoch);
		return response;
	} catch (error) {
		if (getSession().epoch === epoch) endSession();
		throw error;
	}
};

export const bindSessionQueryClient = (queryClient: QueryClient) =>
	useSessionStore.subscribe((state, previous) => {
		if (state.epoch === previous.epoch) return;
		void queryClient.cancelQueries();
		queryClient.clear();
	});

export const startSessionRuntime = (queryClient: QueryClient) => {
	const unbind = bindSessionQueryClient(queryClient);
	let timer: ReturnType<typeof setTimeout> | undefined;
	const schedule = () => {
		clearTimeout(timer);
		const session = getSession();
		if (session.status === "recovering") {
			void ensureAccessToken(session.epoch).catch(() => {
				/* Recovery ends the session on failure. */
			});
		} else if (session.status === "authenticated") {
			const remaining = session.expiresAt - Date.now();
			const lead = Math.min(30000, Math.max(0, remaining * 0.1));
			timer = setTimeout(
				() => {
					if (getSession().epoch !== session.epoch) return;
					if (getSession().expiresAt - Date.now() > lead + 1000) schedule();
					else void refreshSession(session.epoch).catch(() => {});
				},
				Math.min(2147483647, Math.max(0, remaining - lead)),
			);
		}
	};
	const unsubscribe = useSessionStore.subscribe((state, previous) => {
		if (state.epoch !== previous.epoch) {
			useAutoSave.setState({ states: [] });
			useDocumentBranch.getState().resetBranchName();
			useDocumentInfoPopUp.setState({
				documentId: null,
				collapsed: true,
				shared: false,
			});
			useEditorTemplate.setState({ id: 0, title: "", template: null });
			useUserProfilePopup.setState({ userId: 0, collapsed: true });
		}
		if (
			state.epoch !== previous.epoch ||
			state.token !== previous.token ||
			state.status !== previous.status
		)
			schedule();
	});
	const onStorage = (event: StorageEvent) => {
		if (event.key !== ACCESS_TOKEN_KEY && event.key !== null) return;
		const token = localStorage.getItem(ACCESS_TOKEN_KEY);
		if (
			token === getSession().token &&
			getSession().status !== "authenticating"
		)
			return;
		const claims = parseAccessToken(token);
		if (token && claims && claims.user.id === getSession().user?.id)
			commitRefresh(token, getSession().epoch);
		else initializeSession();
	};
	window.addEventListener("storage", onStorage);
	initializeSession();
	schedule();
	return () => {
		clearTimeout(timer);
		unsubscribe();
		unbind();
		window.removeEventListener("storage", onStorage);
	};
};
