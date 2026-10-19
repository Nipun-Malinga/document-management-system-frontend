import { ArrowLeft, Eye, PencilLine } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDocumentContent } from "@/features/documents/hooks";
import useVersionContent from "@/features/documents/hooks/useVersionContent";
import { ContentRenderer } from "@/features/editor";
import {
	EditorError,
	EditorLoading,
} from "@/features/editor/components/EditorFeedback";
import { convertToTiptapContent } from "@/features/editor/utils";
import { collectionErrorMessage } from "@/shared/utils/collectionUtils";

const ContentView = () => {
	const { documentId, branchId, versionId } = useParams();
	const branch = useDocumentContent(documentId ?? "", branchId ?? "");
	const version = useVersionContent(documentId ?? "", versionId ?? "");
	const query = versionId ? version : branch;

	return (
		<div className="flex min-h-0 min-w-0 flex-1 flex-col">
			<header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b bg-card px-3 py-3 sm:px-6 lg:px-8">
				<nav
					aria-label="Preview navigation"
					className="flex flex-wrap items-center gap-2"
				>
					<Button asChild variant="ghost" size="sm">
						<Link to="/dashboard/home">
							<ArrowLeft aria-hidden="true" data-icon="inline-start" />
							Back to Home
						</Link>
					</Button>
					{branchId && (
						<Button asChild variant="outline" size="sm">
							<Link to={`/document/${documentId}/branch/${branchId}/edit`}>
								<PencilLine aria-hidden="true" data-icon="inline-start" />
								Back to editor
							</Link>
						</Button>
					)}
				</nav>
				<Badge variant="secondary">
					<Eye aria-hidden="true" />
					{versionId ? "Version preview" : "Saved branch preview"}
				</Badge>
			</header>
			<main
				aria-label="Document preview"
				className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain bg-muted/40 [scrollbar-gutter:stable]"
			>
				{query.isPending ? (
					<EditorLoading message="Loading preview…" />
				) : query.isError ? (
					<EditorError
						message={collectionErrorMessage(query.error, "this preview")}
					>
						<Button
							variant="outline"
							onClick={() => {
								void query.refetch();
							}}
						>
							Retry preview
						</Button>
					</EditorError>
				) : (
					query.data && (
						<ContentRenderer
							key={`${documentId}/${versionId ?? branchId}/${query.dataUpdatedAt}`}
							content={convertToTiptapContent(query.data.content)}
						/>
					)
				)}
			</main>
		</div>
	);
};
export default ContentView;
