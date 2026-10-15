import type { IMessage } from "@stomp/stompjs";
import { Eye, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import User from "@/features/users/components/User";
import type { Collaborator } from "@/models/Collaborator";
import WebSocketService from "@/services/websocketService";
import { useSessionStore } from "@/states/sessionStore";

interface Props {
	collaborator: Collaborator;
}

const CollaboratorCard = ({ collaborator }: Props) => {
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
		<div className="flex min-w-0 flex-wrap items-start gap-3 p-4">
			<User username={collaborator.username} />
			<div className="flex min-w-0 flex-1 flex-col gap-1.5">
				<div className="flex flex-wrap items-center gap-2">
					<p className="wrap-anywhere text-sm font-medium">
						{collaborator.username}
					</p>
					<span className="text-xs text-muted-foreground">
						{status ? "Online" : "Offline"}
					</span>
				</div>
				<p className="wrap-anywhere text-xs leading-relaxed text-muted-foreground">
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
