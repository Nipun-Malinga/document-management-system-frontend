import { FileText, GitBranch, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	useTrashBranchCount,
	useTrashDocumentCount,
} from "@/features/workspace/hooks";
import CollectionPage from "../components/collections/CollectionPage";
import { TrashBranchTable, TrashDocumentTable } from "../components/trash";

const TrashCount = ({
	count,
	pending,
}: {
	count?: number;
	pending: boolean;
}) => (
	<Badge variant="secondary" className="min-w-6 tabular-nums">
		{count ?? (
			<>
				<span aria-hidden="true">—</span>
				<span className="sr-only">
					{pending ? "count loading" : "count unavailable"}
				</span>
			</>
		)}
	</Badge>
);

const Trash = () => {
	const documents = useTrashDocumentCount();
	const branches = useTrashBranchCount();

	return (
		<CollectionPage
			icon={Trash2}
			title="Trash"
			description="Restore documents and branches, or delete them permanently."
		>
			<Tabs defaultValue="documents" className="min-w-0 flex-1 gap-6">
				<TabsList
					aria-label="Trash collections"
					className="h-12 w-full max-w-md shrink-0 p-1"
				>
					<TabsTrigger value="documents" className="gap-2">
						<FileText aria-hidden="true" className="hidden sm:block" />
						Documents
						<TrashCount
							count={documents.data?.count}
							pending={documents.isPending}
						/>
					</TabsTrigger>
					<TabsTrigger value="branches" className="gap-2">
						<GitBranch aria-hidden="true" className="hidden sm:block" />
						Branches
						<TrashCount
							count={branches.data?.count}
							pending={branches.isPending}
						/>
					</TabsTrigger>
				</TabsList>
				<TabsContent
					value="documents"
					className="min-w-0 data-[state=active]:flex data-[state=active]:flex-col focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
				>
					<TrashDocumentTable />
				</TabsContent>
				<TabsContent
					value="branches"
					className="min-w-0 data-[state=active]:flex data-[state=active]:flex-col focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
				>
					<TrashBranchTable />
				</TabsContent>
			</Tabs>
		</CollectionPage>
	);
};

export default Trash;
