import { UserPlus } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { actionError } from "@/features/editor/persistence/actionError";
import { SearchUser } from "@/features/users";
import { useShareDocument } from "@/hooks/document/collaboration";
import { useUser } from "@/hooks/user";
import type { Collaborator } from "@/models/Collaborator";
import type { Document } from "@/models/Document";
import Collaborators from "./Collaborators";

const CollaboratorTabs = ({ document }: { document: Document }) => {
	const [inviteOpen, setInviteOpen] = useState(false);
	const [permission, setPermission] =
		useState<Collaborator["permission"]>("READ_WRITE");
	const [error, setError] = useState("");
	const [notice, setNotice] = useState("");
	const { mutateAsync, isPending } = useShareDocument(document.id);
	const user = useUser();
	const isOwner = document.ownerId === user?.id;
	const inviteId = useId();
	const inviteButton = useRef<HTMLButtonElement>(null);
	const returnFocus = useRef(false);
	const adding = useRef(false);
	const closeInvite = () => {
		returnFocus.current = true;
		setInviteOpen(false);
	};
	useEffect(() => {
		if (!inviteOpen && !isPending && returnFocus.current) {
			inviteButton.current?.focus();
			returnFocus.current = false;
		}
	}, [inviteOpen, isPending]);
	const grantAccess = async (userId: number) => {
		if (!isOwner || adding.current) return;
		adding.current = true;
		setError("");
		setNotice("");
		try {
			await mutateAsync({ userId, permission });
			setNotice("Collaborator added.");
			closeInvite();
		} catch (error) {
			setError(actionError(error));
		} finally {
			adding.current = false;
		}
	};

	return (
		<Collaborators
			documentId={document.id}
			actions={
				isOwner && (
					<Button
						ref={inviteButton}
						type="button"
						disabled={isPending}
						aria-expanded={inviteOpen}
						aria-controls={inviteId}
						onClick={() => {
							if (inviteOpen) closeInvite();
							else {
								setError("");
								setNotice("");
								setInviteOpen(true);
							}
						}}
					>
						<UserPlus aria-hidden="true" data-icon="inline-start" />
						{inviteOpen ? "Close invitation" : "Add people"}
					</Button>
				)
			}
		>
			{notice && <p className="text-sm text-primary">{notice}</p>}
			{isOwner && (
				<section
					id={inviteId}
					hidden={!inviteOpen}
					aria-label="Invite a collaborator"
					className="rounded-xl border bg-muted/30 p-4"
				>
					{inviteOpen && (
						<SearchUser
							title="Give someone access"
							subTitle="Find a person by email, then choose what they can do."
							onClick={(userId) => {
								void grantAccess(userId);
							}}
							userPending={isPending}
							actionLabel="Grant access"
							onCancel={closeInvite}
						>
							<Field className="gap-2">
								<FieldLabel htmlFor={`${inviteId}-permission`}>
									Access level
								</FieldLabel>
								<Select
									value={permission}
									onValueChange={(value) =>
										setPermission(value as Collaborator["permission"])
									}
									disabled={isPending}
								>
									<SelectTrigger
										id={`${inviteId}-permission`}
										className="w-full bg-background shadow-none data-[size=default]:h-10"
									>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											<SelectItem value="READ_ONLY">Can view</SelectItem>
											<SelectItem value="READ_WRITE">Can edit</SelectItem>
										</SelectGroup>
									</SelectContent>
								</Select>
							</Field>
						</SearchUser>
					)}
					{error && (
						<p role="alert" className="mt-3 text-sm text-destructive">
							{error}
						</p>
					)}
				</section>
			)}
		</Collaborators>
	);
};

export default CollaboratorTabs;
