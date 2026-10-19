import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useDocument } from "@/features/documents/hooks";
import { collectionErrorMessage } from "@/shared/utils/collectionUtils";
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
				<div>
					<p>{collectionErrorMessage(error, "this document")}</p>
					<Button
						onClick={() => {
							void refetch();
						}}
					>
						Retry document
					</Button>
				</div>
			) : (
				<p>Loading document…</p>
			)}
		</>
	);
};
export default EditorContainer;
