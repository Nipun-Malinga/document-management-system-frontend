import type { QueryClient } from "@tanstack/react-query";
import type {
	SignInRequest,
	SignInResponse,
} from "@/features/auth/schemas/SignIn";
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
} from "@/features/auth/stores/sessionStore";
import { parseAccessToken } from "@/features/auth/utils/tokenUtils";
import useDocumentInfoPopUp from "@/features/documents/stores/useDocumentInfoPopup";
import useAutoSave from "@/features/editor/stores/useAutoSave";
import useDocumentBranch from "@/features/editor/stores/useDocumentBranch";
import useEditorTemplate from "@/features/editor/stores/useEditorTemplate";
import useUserProfilePopup from "@/features/users/stores/useUserProfilePopup";
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
			useUserProfilePopup.setState({ collapsed: true });
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
