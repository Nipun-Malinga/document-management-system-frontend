import {
	endSession,
	getSession,
	replaceAccessToken,
} from "@/states/sessionStore";

export const getAccessToken = () => getSession().token;
export const updateAccessToken = replaceAccessToken;
export const clearAccessToken = endSession;
