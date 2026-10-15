import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import useDocumentAccess from "@/hooks/document/useDocumentAccess";
import { collectionErrorMessage } from "@/utils/collectionUtils";
import CollaborativeEditorCore from "../components/CollaborativeEditorCore";
import EditorContainer from "../components/EditorContainer";

const CollaborativeEditor = () => {
	const { documentId, branchId } = useParams();

	const access = useDocumentAccess(documentId ?? "", branchId ?? "");

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
