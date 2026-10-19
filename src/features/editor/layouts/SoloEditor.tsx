import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getSession } from "@/features/auth/stores/sessionStore";
import { useDocument, useDocumentContent } from "@/features/documents/hooks";
import useDocumentAccess from "@/features/documents/hooks/useDocumentAccess";
import { collectionErrorMessage } from "@/shared/utils/collectionUtils";
import EditorContainer from "../components/EditorContainer";
import { EditorError, EditorLoading } from "../components/EditorFeedback";
import SoloEditorCore from "../components/SoloEditorCore";
import { actionError } from "../persistence/actionError";
import { usePersistenceRegistry } from "../persistence/persistenceRegistry";
import { convertToTiptapContent } from "../utils";

export const SoloEditor = ({
	onOpenCollaboration,
}: {
	onOpenCollaboration: () => void;
}) => {
	const { documentId, branchId } = useParams();
	const [switching, setSwitching] = useState(false);
	const [switchError, setSwitchError] = useState("");
	const metadata = useDocument(documentId ?? "");
	const contentQuery = useDocumentContent(documentId ?? "", branchId ?? "");
	const { data } = contentQuery;
	const access = useDocumentAccess(documentId ?? "", branchId ?? "");
	const openCollaboration = async () => {
		setSwitching(true);
		setSwitchError("");
		try {
			const active = usePersistenceRegistry.getState().active;
			if (
				!active ||
				active.documentId !== documentId ||
				active.branchId !== branchId ||
				active.epoch !== getSession().epoch ||
				active.mode !== "solo" ||
				!active.coordinator
			)
				throw new Error("The document editor is still preparing. Try again.");
			await active.coordinator.prepareToLeave();
			if (usePersistenceRegistry.getState().active !== active) return;
			onOpenCollaboration();
		} catch (error) {
			setSwitchError(actionError(error));
		} finally {
			setSwitching(false);
		}
	};

	if (access.isPending)
		return <EditorLoading message="Checking document access..." />;
	if (access.isError)
		return (
			<EditorError
				message={collectionErrorMessage(access.error, "document access")}
			>
				<Button
					variant="outline"
					onClick={() => {
						void access.retry();
					}}
				>
					Retry access check
				</Button>
			</EditorError>
		);
	if (!access.canRead)
		return <EditorError message="You do not have access to this document." />;

	if (!(documentId && branchId)) return null;
	if (!data)
		return contentQuery.isError ? (
			<EditorError message="Unable to load saved content. The editor has not been opened.">
				<Button
					variant="outline"
					onClick={() => {
						void contentQuery.refetch();
					}}
				>
					Retry loading content
				</Button>
			</EditorError>
		) : (
			<EditorLoading message="Loading saved content…" />
		);

	return (
		<EditorContainer>
			{metadata.data?.shared && (
				<div className="flex shrink-0 flex-col items-start gap-3 border-b bg-secondary/40 px-4 py-4 text-sm sm:px-6">
					<p>
						This document is now shared. Open the collaborative editor to
						continue editing.
					</p>
					<Button
						type="button"
						disabled={switching}
						onClick={() => {
							void openCollaboration();
						}}
					>
						Open collaborative editor
					</Button>
					{switchError && (
						<p role="alert" className="text-destructive">
							{switchError}
						</p>
					)}
				</div>
			)}
			<SoloEditorCore
				key={`${documentId}/${branchId}`}
				documentId={documentId}
				branchId={branchId}
				editable={access.canWrite && !metadata.data?.shared}
				content={convertToTiptapContent(data.content)}
			/>
		</EditorContainer>
	);
};

export default SoloEditor;
