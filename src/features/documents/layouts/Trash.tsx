import { FileText, GitBranch } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTrashBranchCount, useTrashDocumentCount } from "@/hooks/sidebar";
import CollectionPage from "../components/collections/CollectionPage";
import { TrashBranchTable, TrashDocumentTable } from "../components/trash";

const TrashCount = ({
	count,
	pending,
}: {
	count?: number;
	pending: boolean;
}) => (
	<span className="rounded-sm bg-muted px-1.5 py-0.5 text-xs tabular-nums">
		{count ?? (
			<>
				<span aria-hidden="true">—</span>
				<span className="sr-only">
					{pending ? "count loading" : "count unavailable"}
				</span>
			</>
		)}
	</span>
);

const Trash = () => {
	const documents = useTrashDocumentCount();
	const branches = useTrashBranchCount();

	return (
		<CollectionPage
			title="Trash"
			description="Restore documents and branches, or delete them permanently."
		>
			<Tabs defaultValue="documents" className="min-h-0 min-w-0 flex-1 gap-5">
				<TabsList
					aria-label="Trash collections"
					className="h-11 w-full max-w-sm shrink-0 p-1"
				>
					<TabsTrigger value="documents" className="gap-2">
						<FileText aria-hidden="true" />
						Documents
						<TrashCount
							count={documents.data?.count}
							pending={documents.isPending}
						/>
					</TabsTrigger>
					<TabsTrigger value="branches" className="gap-2">
						<GitBranch aria-hidden="true" />
						Branches
						<TrashCount
							count={branches.data?.count}
							pending={branches.isPending}
						/>
					</TabsTrigger>
				</TabsList>
				<TabsContent
					value="documents"
					className="min-h-0 min-w-0 data-[state=active]:flex data-[state=active]:flex-col"
				>
					<TrashDocumentTable />
				</TabsContent>
				<TabsContent
					value="branches"
					className="min-h-0 min-w-0 data-[state=active]:flex data-[state=active]:flex-col"
				>
					<TrashBranchTable />
				</TabsContent>
			</Tabs>
		</CollectionPage>
	);
};

export default Trash;
