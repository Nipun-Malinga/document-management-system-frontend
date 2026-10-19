import { getSession } from "@/features/auth/stores/sessionStore";

export const getAccessToken = () => getSession().token;
export {
	endSession,
	replaceAccessToken,
} from "@/features/auth/stores/sessionStore";
