import { jwtDecode } from "jwt-decode";
import type { User } from "@/models/User";

export type SessionUser = Omit<User, "firstname" | "lastname">;

export const parseAccessToken = (
	token: string | null,
	allowExpired = false,
): { user: SessionUser; expiresAt: number } | null => {
	try {
		if (!token) return null;
		const parts = token.split(".");
		if (parts.length !== 3 || parts.some((part) => !part)) return null;

		const { alg } = jwtDecode<{ alg?: unknown }>(token, { header: true });
		if (typeof alg !== "string" || !alg || alg === "none") return null;

		const { sub, username, email, role, exp, token_type } = jwtDecode<{
			sub: string;
			username: string;
			email: string;
			role: User["role"];
			exp: number;
			token_type?: string;
		}>(token);

		const id = Number(sub);
		const expiresAt = exp * 1000;
		if (
			typeof sub !== "string" ||
			!/^[1-9]\d*$/.test(sub) ||
			!Number.isSafeInteger(id) ||
			typeof username !== "string" ||
			!username.trim() ||
			typeof email !== "string" ||
			!email.trim() ||
			(role !== "USER" && role !== "ADMIN") ||
			(token_type !== undefined && token_type !== "access") ||
			typeof exp !== "number" ||
			!Number.isFinite(expiresAt) ||
			(!allowExpired && exp <= Date.now() / 1000)
		)
			return null;
		return { user: { id, username, email, role }, expiresAt };
	} catch {
		return null;
	}
};
