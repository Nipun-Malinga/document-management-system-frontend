import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useFolderMutation } from "@/features/documents/hooks/useFolders";
import type { Folder, FolderAction } from "@/features/documents/types/Folder";
import { descendantIds } from "@/features/documents/utils/folderTree";
import { actionError } from "@/features/editor/persistence/actionError";
import FolderDestination, { ROOT_DESTINATION } from "./FolderDestination";

export type FolderDialogAction =
	| { type: "create"; parentFolderId: string | null }
	| { type: "rename" | "move" | "delete"; folder: Folder };

interface Props {
	action: FolderDialogAction;
	folders: Folder[];
	onClose: () => void;
	onDeleted: (folderId: string) => void;
}

const FolderDialog = ({ action, folders, onClose, onDeleted }: Props) => {
	const mutation = useFolderMutation();
	const [name, setName] = useState(
		action.type === "rename" ? action.folder.name : "",
	);
	const [destination, setDestination] = useState("");
	const submit = async () => {
		let request: FolderAction;
		switch (action.type) {
			case "create":
				request = { ...action, name: name.trim() };
				break;
			case "rename":
				request = {
					type: "rename",
					folderId: action.folder.id,
					name: name.trim(),
				};
				break;
			case "move":
				request = {
					type: "move",
					folderId: action.folder.id,
					parentFolderId: destination === ROOT_DESTINATION ? null : destination,
				};
				break;
			case "delete":
				request = { type: "delete", folderId: action.folder.id };
				break;
		}
		try {
			await mutation.mutateAsync(request);
			if (action.type === "delete") onDeleted(action.folder.id);
			onClose();
		} catch {
			/* Keep inputs and the error visible for retry. */
		}
	};
	const error = mutation.isError ? (
		<Alert variant="destructive">
			<AlertDescription>{actionError(mutation.error)}</AlertDescription>
		</Alert>
	) : null;
	if (action.type === "delete")
		return (
			<AlertDialog
				open
				onOpenChange={(open) => {
					if (!open && !mutation.isPending) onClose();
				}}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Delete “{action.folder.name}” permanently?
						</AlertDialogTitle>
						<AlertDialogDescription>
							All nested folders and their documents, branches, versions, and
							content will be permanently deleted. They will not go to Trash.
							This cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					{error}
					<AlertDialogFooter>
						<AlertDialogCancel disabled={mutation.isPending}>
							Cancel
						</AlertDialogCancel>
						<Button
							variant="destructive"
							disabled={mutation.isPending}
							onClick={() => void submit()}
						>
							{mutation.isPending ? "Deleting…" : "Delete permanently"}
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		);
	const isMove = action.type === "move";
	const title =
		action.type === "create"
			? "New folder"
			: isMove
				? "Move folder"
				: "Rename folder";
	const excluded = isMove
		? descendantIds(folders, action.folder.id)
		: undefined;
	const unchangedDestination =
		isMove &&
		(destination === ROOT_DESTINATION ? null : destination) ===
			action.folder.parentFolderId;
	return (
		<Dialog
			open
			onOpenChange={(open) => {
				if (!open && !mutation.isPending) onClose();
			}}
		>
			<DialogContent showCloseButton={!mutation.isPending}>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>
						{isMove
							? `Choose a new parent for “${action.folder.name}”. Its contents move with it.`
							: action.type === "create"
								? "Organize your documents with a folder."
								: "Choose a name for this folder."}
					</DialogDescription>
				</DialogHeader>
				<form
					className="flex min-w-0 flex-col gap-5"
					onSubmit={(event) => {
						event.preventDefault();
						void submit();
					}}
				>
					<FieldGroup>
						{isMove ? (
							<FolderDestination
								folders={folders}
								value={destination}
								onChange={setDestination}
								excluded={excluded}
								allowRoot
								disabled={mutation.isPending}
							/>
						) : (
							<Field>
								<FieldLabel htmlFor="folder-name">Folder name</FieldLabel>
								<Input
									id="folder-name"
									value={name}
									onChange={(event) => setName(event.target.value)}
									required
									maxLength={255}
									disabled={mutation.isPending}
								/>
							</Field>
						)}
					</FieldGroup>
					{error}
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							disabled={mutation.isPending}
							onClick={onClose}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={
								mutation.isPending ||
								(isMove ? !destination || unchangedDestination : !name.trim())
							}
						>
							{mutation.isPending
								? "Saving…"
								: isMove
									? "Move folder"
									: "Save folder"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default FolderDialog;
