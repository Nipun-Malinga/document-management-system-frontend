import { getSession } from "@/states/sessionStore";

export const getAccessToken = () => getSession().token;
export { endSession, replaceAccessToken } from "@/states/sessionStore";
