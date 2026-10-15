import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useDocument } from "@/hooks/document";
import { collectionErrorMessage } from "@/utils/collectionUtils";
import EditorNavigationGuard from "../persistence/EditorNavigationGuard";
import CollaborativeEditor from "./CollaborativeEditor";
import SoloEditor from "./SoloEditor";

// A metadata refresh must not replace a mounted editor with a different persistence mode.
const EditorMode = ({ shared }: { shared: boolean }) => {
	const [collaborative] = useState(shared);
	return <>{collaborative ? <CollaborativeEditor /> : <SoloEditor />}</>;
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
