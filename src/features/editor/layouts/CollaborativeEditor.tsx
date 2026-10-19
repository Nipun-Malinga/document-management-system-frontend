import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import useDocumentAccess from "@/features/documents/hooks/useDocumentAccess";
import { collectionErrorMessage } from "@/shared/utils/collectionUtils";
import CollaborativeEditorCore from "../components/CollaborativeEditorCore";
import EditorContainer from "../components/EditorContainer";
import { EditorError, EditorLoading } from "../components/EditorFeedback";

const CollaborativeEditor = () => {
	const { documentId, branchId } = useParams();

	const access = useDocumentAccess(documentId ?? "", branchId ?? "");

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

	return (
		<EditorContainer>
			<CollaborativeEditorCore
				key={`${documentId}/${branchId}`}
				documentId={documentId}
				branchId={branchId}
				editable={access.canWrite}
			/>
		</EditorContainer>
	);
};

export default CollaborativeEditor;
