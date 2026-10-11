import { type ReactNode, useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import { ensureAccessToken } from "@/services/apiService";
import { getSession, useSessionStore } from "@/states/sessionStore";

interface Props {
	children: ReactNode;
	navigation?: string;
	type?: "ADMIN" | "USER";
}

const SecureRoute = ({ children, navigation, type = "USER" }: Props) => {
	const session = useSessionStore();
	const mountedEpoch = useRef<number | null>(null);
	const validRole =
		session.user && (type !== "ADMIN" || session.user.role === "ADMIN");
	const recovering =
		session.status === "recovering" ||
		(session.status === "authenticated" && session.expiresAt <= Date.now());
	const authorized =
		validRole && session.status === "authenticated" && !recovering;
	if (authorized) mountedEpoch.current = session.epoch;
	const keepMounted =
		validRole && recovering && mountedEpoch.current === session.epoch;

	useEffect(() => {
		if (recovering && getSession().epoch === session.epoch)
			void ensureAccessToken(session.epoch).catch(() => {});
	}, [recovering, session.epoch]);

	if (!authorized && !recovering) {
		return (
			<Navigate
				to={
					navigation ||
					(type === "ADMIN" ? "/admin/auth/signin" : "/auth/signin")
				}
				replace
			/>
		);
	}
	return (
		<>
			{recovering && <p role="status">Restoring your session...</p>}
			<div
				key={session.epoch}
				hidden={recovering}
				inert={recovering}
				style={{ display: recovering ? "none" : "contents" }}
			>
				{authorized || keepMounted ? children : null}
			</div>
		</>
	);
};
export default SecureRoute;
