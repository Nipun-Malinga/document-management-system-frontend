import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useDocument, useDocumentContent } from "@/hooks/document";
import useDocumentAccess from "@/hooks/document/useDocumentAccess";
import { getSession } from "@/states/sessionStore";
import { collectionErrorMessage } from "@/utils/collectionUtils";
import EditorContainer from "../components/EditorContainer";
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
			// Refuse to discard unsaved edits if sharing changed in another window.
			await active.coordinator.prepareToLeave();
			if (usePersistenceRegistry.getState().active !== active) return;
			onOpenCollaboration();
		} catch (error) {
			setSwitchError(actionError(error));
		} finally {
			setSwitching(false);
		}
	};

	if (access.isPending) return <p>Checking document access...</p>;
	if (access.isError)
		return (
			<div role="alert">
				<p>{collectionErrorMessage(access.error, "document access")}</p>
				<Button
					variant="outline"
					onClick={() => {
						void access.retry();
					}}
				>
					Retry access check
				</Button>
			</div>
		);
	if (!access.canRead)
		return <p role="alert">You do not have access to this document.</p>;

	if (!(documentId && branchId)) return null;
	if (!data)
		return contentQuery.isError ? (
			<div role="alert">
				<p>Unable to load saved content. The editor has not been opened.</p>
				<Button
					variant="outline"
					onClick={() => {
						void contentQuery.refetch();
					}}
				>
					Retry loading content
				</Button>
			</div>
		) : (
			<p>Loading saved content…</p>
		);

	return (
		<EditorContainer>
			{metadata.data?.shared && (
				<div className="flex flex-col gap-2">
					<p role="status">
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
					{switchError && <p role="alert">{switchError}</p>}
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
