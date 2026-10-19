import { ArrowUpRight, Bookmark, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { useUser } from "@/features/auth/hooks";
import { useToggleFavorite } from "@/features/documents/hooks";
import useDocumentInfoPopUp from "@/features/documents/stores/useDocumentInfoPopup";
import type { Document } from "@/features/documents/types/Document";
import { actionError } from "@/features/editor/persistence/actionError";
import useDocumentBranch from "@/features/editor/stores/useDocumentBranch";
import DocumentTile from "./DocumentTile";
import DocumentFolderAction from "./folders/DocumentFolderAction";

interface Props {
	document: Document;
	folderId?: string | null;
}

const DocumentCard = ({ document, folderId }: Props) => {
	const user = useUser();
	const isOwner = document.ownerId === user?.id;
	const { setDocumentId, collapsed, toggleDocumentInfoPopup, setShared } =
		useDocumentInfoPopUp();
	const { resetBranchName } = useDocumentBranch();
	const {
		mutate: toggleFavorite,
		isPending,
		isError,
		error,
	} = useToggleFavorite(document.id);

	return (
		<DocumentTile
			document={document}
			disabled={!collapsed}
			actions={
				<>
					{isOwner && folderId !== undefined && (
						<DocumentFolderAction document={document} folderId={folderId} />
					)}
					{isOwner && (
						<Toggle
							aria-label="Toggle bookmark"
							title={
								document.favorite ? "Remove bookmark" : "Bookmark document"
							}
							disabled={isPending}
							size="sm"
							pressed={document.favorite}
							onPressedChange={() => {
								if (isOwner) toggleFavorite();
							}}
						>
							<Bookmark
								aria-hidden="true"
								fill={document.favorite ? "currentColor" : "none"}
							/>
						</Toggle>
					)}
					<Button
						type="button"
						variant="ghost"
						size="icon"
						aria-label={`Information about ${document.title}`}
						onClick={() => {
							toggleDocumentInfoPopup();
							resetBranchName();
							setDocumentId(document.id);
							setShared(document.shared);
						}}
					>
						<Info aria-hidden="true" />
					</Button>
				</>
			}
			openAction={
				<Button asChild variant="ghost" size="sm">
					<Link
						to={`/document/${document.id}/branch/${document.mainBranchId}/edit`}
						aria-label={`Open ${document.title}`}
					>
						Open
						<ArrowUpRight aria-hidden="true" data-icon="inline-end" />
					</Link>
				</Button>
			}
			error={
				isError && (
					<p role="alert" className="px-4 text-sm text-destructive">
						{actionError(error)}
					</p>
				)
			}
		/>
	);
};
export default DocumentCard;
