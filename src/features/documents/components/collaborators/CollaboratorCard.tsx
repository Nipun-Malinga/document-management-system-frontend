import type { IMessage } from "@stomp/stompjs";
import { Eye, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useSessionStore } from "@/features/auth/stores/sessionStore";
import type { Collaborator } from "@/features/documents/types/Collaborator";
import User from "@/features/users/components/User";
import { cn } from "@/lib/utils";
import WebSocketService from "@/services/websocketService";

interface Props {
	collaborator: Collaborator;
	compact?: boolean;
}

const CollaboratorCard = ({ collaborator, compact = false }: Props) => {
	const [status, setStatus] = useState<boolean>(false);

	const epoch = useSessionStore((state) => state.epoch);
	const userId = collaborator.userId;

	// biome-ignore lint/correctness/useExhaustiveDependencies: A session epoch change must reset status and resubscribe, even for the same user.
	useEffect(() => {
		const ws = WebSocketService.getInstance();
		setStatus(false);
		const receive = (payload: IMessage) => {
			try {
				const value: unknown = JSON.parse(payload.body);
				if (typeof value === "boolean") setStatus(value);
			} catch {
				console.error("Invalid user status message");
			}
		};
		const reset = () => setStatus(false);
		const unsubscribeUpdates = ws.subscribe(
			`/user/${userId}/status`,
			receive,
			reset,
		);
		const unsubscribeInitial = ws.subscribe(
			`/app/user/${userId}/status`,
			receive,
			reset,
		);
		return () => {
			unsubscribeInitial();
			unsubscribeUpdates();
		};
	}, [userId, epoch]);

	const canEdit = collaborator.permission === "READ_WRITE";
	const PermissionIcon = canEdit ? Pencil : Eye;
	return (
		<div
			className={cn(
				"flex min-w-0 flex-wrap items-start gap-3 p-4",
				compact && "h-[55px] flex-nowrap items-center gap-2 px-3 py-2",
			)}
		>
			<User username={collaborator.username} />
			<div
				className={cn(
					"flex min-w-0 flex-1 flex-col gap-1.5",
					compact && "gap-0.5",
				)}
			>
				<div
					className={cn(
						"flex flex-wrap items-center gap-2",
						compact && "flex-nowrap",
					)}
				>
					<p
						title={collaborator.username}
						className={cn(
							"wrap-anywhere text-sm font-medium",
							compact && "truncate",
						)}
					>
						{collaborator.username}
					</p>
					<span
						className={cn(
							"text-xs text-muted-foreground",
							compact && "sr-only",
						)}
					>
						{status ? "Online" : "Offline"}
					</span>
				</div>
				<p
					title={collaborator.email}
					className={cn(
						"wrap-anywhere text-xs leading-relaxed text-muted-foreground",
						compact && "truncate",
					)}
				>
					{collaborator.email}
				</p>
			</div>
			<Badge variant={canEdit ? "secondary" : "outline"} className="shrink-0">
				<PermissionIcon aria-hidden="true" />
				{canEdit ? "Can edit" : "Can view"}
			</Badge>
		</div>
	);
};

export default CollaboratorCard;
