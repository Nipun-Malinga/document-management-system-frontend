import { FolderInput, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FieldGroup } from "@/components/ui/field";
import {
	useFolderMutation,
	useFolders,
} from "@/features/documents/hooks/useFolders";
import type { Document } from "@/features/documents/types/Document";
import { actionError } from "@/features/editor/persistence/actionError";
import FolderDestination, { ROOT_DESTINATION } from "./FolderDestination";

interface Props {
	document: Document;
	folderId: string | null;
}

const DocumentFolderAction = ({ document, folderId }: Props) => {
	const [open, setOpen] = useState(false);
	const [destination, setDestination] = useState("");
	const folders = useFolders();
	const mutation = useFolderMutation();
	const close = () => {
		setOpen(false);
		setDestination("");
		mutation.reset();
	};
	const submit = async () => {
		try {
			if (folderId && destination === ROOT_DESTINATION)
				await mutation.mutateAsync({
					type: "removeDocument",
					documentId: document.id,
					folderId,
				});
			else if (folderId)
				await mutation.mutateAsync({
					type: "moveDocument",
					documentId: document.id,
					folderId,
					targetFolderId: destination,
				});
			else
				await mutation.mutateAsync({
					type: "assignDocument",
					documentId: document.id,
					folderId: destination,
				});
			close();
		} catch(error) {
			console.error("Error moving document:", error);
		}
	};
	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						aria-label={`Folder actions for ${document.title}`}
					>
						<MoreHorizontal aria-hidden="true" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuGroup>
						<DropdownMenuItem onSelect={() => setOpen(true)}>
							<FolderInput aria-hidden="true" />
							Move to folder
						</DropdownMenuItem>
						{folderId && (
							<DropdownMenuItem
								onSelect={() => {
									setDestination(ROOT_DESTINATION);
									setOpen(true);
								}}
							>
								Remove from folder
							</DropdownMenuItem>
						)}
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
			<Dialog
				open={open}
				onOpenChange={(value) => {
					if (!mutation.isPending) {
						if (value) setOpen(true);
						else close();
					}
				}}
			>
				<DialogContent showCloseButton={!mutation.isPending}>
					<DialogHeader>
						<DialogTitle>Move document</DialogTitle>
						<DialogDescription>
							Choose where to keep “{document.title}”.{" "}
							{folderId
								? "Choose No folder to remove it from this folder and preserve the document."
								: "Documents can also remain outside folders."}
						</DialogDescription>
					</DialogHeader>
					<form
						className="flex flex-col gap-5"
						onSubmit={(event) => {
							event.preventDefault();
							void submit();
						}}
					>
						{folders.isError ? (
							<Alert>
								<AlertDescription>
									<p>
										Could not load destinations. {actionError(folders.error)}
									</p>
									<Button
										type="button"
										variant="outline"
										onClick={() => void folders.refetch()}
									>
										Try again
									</Button>
								</AlertDescription>
							</Alert>
						) : folders.isPending ? (
							<p>Loading folders…</p>
						) : (
							<FieldGroup>
								<FolderDestination
									folders={folders.data}
									value={destination}
									onChange={setDestination}
									excluded={folderId ? new Set([folderId]) : undefined}
									allowRoot={Boolean(folderId)}
									disabled={mutation.isPending}
								/>
							</FieldGroup>
						)}
						{folders.isSuccess && !folderId && !folders.data.length && (
							<p className="text-sm text-muted-foreground">
								Create a folder in the Folders section first.
							</p>
						)}
						{mutation.isError && (
							<Alert variant="destructive">
								<AlertDescription>
									{actionError(mutation.error)}
								</AlertDescription>
							</Alert>
						)}
						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								disabled={mutation.isPending}
								onClick={close}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={
									mutation.isPending || !folders.isSuccess || !destination
								}
							>
								{mutation.isPending
									? "Moving…"
									: destination === ROOT_DESTINATION
										? "Remove from folder"
										: "Move document"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default DocumentFolderAction;
