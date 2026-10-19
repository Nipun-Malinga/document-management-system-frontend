import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useDocumentContent } from "@/features/documents/hooks";
import useVersionContent from "@/features/documents/hooks/useVersionContent";
import { ContentRenderer } from "@/features/editor";
import { convertToTiptapContent } from "@/features/editor/utils";
import { collectionErrorMessage } from "@/shared/utils/collectionUtils";

const ContentView = () => {
	const { documentId, branchId, versionId } = useParams();
	const branch = useDocumentContent(documentId ?? "", branchId ?? "");
	const version = useVersionContent(documentId ?? "", versionId ?? "");
	const query = versionId ? version : branch;

	return (
		<div className="w-full h-dvh rounded-md overflow-y-auto">
			<nav className="p-3 flex flex-wrap gap-3 text-sm">
				<Link to="/dashboard/home">Back to Home</Link>
				{branchId && (
					<Link to={`/document/${documentId}/branch/${branchId}/edit`}>
						Back to editor
					</Link>
				)}
			</nav>
			<p className="px-3 text-sm text-muted-foreground">
				{versionId ? "Version preview" : "Saved branch preview"}
			</p>
			{query.isPending ? (
				<p>Loading preview…</p>
			) : query.isError ? (
				<div role="alert">
					<p>{collectionErrorMessage(query.error, "this preview")}</p>
					<Button
						variant="outline"
						onClick={() => {
							void query.refetch();
						}}
					>
						Retry preview
					</Button>
				</div>
			) : (
				query.data && (
					<ContentRenderer
						key={`${documentId}/${versionId ?? branchId}/${query.dataUpdatedAt}`}
						content={convertToTiptapContent(query.data.content)}
					/>
				)
			)}
		</div>
	);
};
export default ContentView;
