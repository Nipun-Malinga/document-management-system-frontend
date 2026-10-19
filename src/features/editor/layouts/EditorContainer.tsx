import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useDocument } from "@/features/documents/hooks";
import { collectionErrorMessage } from "@/shared/utils/collectionUtils";
import { EditorError, EditorLoading } from "../components/EditorFeedback";
import EditorNavigationGuard from "../persistence/EditorNavigationGuard";
import CollaborativeEditor from "./CollaborativeEditor";
import SoloEditor from "./SoloEditor";

// Keep the mounted mode until saved edits are safe and the user chooses to switch.
const EditorMode = ({ shared }: { shared: boolean }) => {
	const [collaborative, setCollaborative] = useState(shared);
	return collaborative ? (
		<CollaborativeEditor />
	) : (
		<SoloEditor onOpenCollaboration={() => setCollaborative(true)} />
	);
};

const EditorContainer = () => {
	const { documentId, branchId } = useParams();
	const { data, isError, error, refetch } = useDocument(documentId ?? "");
	return (
		<>
			<EditorNavigationGuard />
			{data ? (
				<EditorMode key={`${documentId}/${branchId}`} shared={data.shared} />
			) : isError ? (
				<EditorError message={collectionErrorMessage(error, "this document")}>
					<Button
						onClick={() => {
							void refetch();
						}}
					>
						Retry document
					</Button>
				</EditorError>
			) : (
				<EditorLoading message="Loading document…" />
			)}
		</>
	);
};
export default EditorContainer;
