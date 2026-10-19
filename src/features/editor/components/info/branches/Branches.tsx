import { GitBranch } from "lucide-react";
import { useParams } from "react-router-dom";
import {
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";
import CollectionFilter from "@/features/documents/components/collections/CollectionFilter";
import CollectionPagination from "@/features/documents/components/collections/CollectionPagination";
import CollectionResults from "@/features/documents/components/collections/CollectionResults";
import {
	branchSorts,
	statusField,
} from "@/features/documents/components/collections/collectionFilterOptions";
import { useBranches } from "@/features/documents/hooks";
import type { BranchParams } from "@/features/documents/types/CollectionParams";
import useCollectionParams from "@/shared/hooks/useCollectionParams";
import InfoDrawerBody, { InfoDrawerEmpty } from "../InfoDrawerBody";
import BranchCard from "./BranchCard";
import BranchCreateForm from "./BranchCreateForm";

const Branches = () => {
	const { documentId } = useParams();
	const { params, update, setPage } =
		useCollectionParams<BranchParams>(documentId);
	const query = useBranches(documentId ?? "", params);

	return (
		<>
			<DrawerHeader className="editor-history-header shrink-0 px-4 py-6 text-left sm:px-6">
				<div className="flex items-start justify-between gap-4">
					<div className="flex min-w-0 flex-col gap-2">
						<DrawerTitle>Branches</DrawerTitle>
						<DrawerDescription>
							Create a branch to explore changes alongside your current work.
						</DrawerDescription>
					</div>
					<span aria-hidden="true" className="editor-history-symbol">
						<GitBranch />
					</span>
				</div>
			</DrawerHeader>
			<InfoDrawerBody emptyTitle="Branches" emptyDescription="">
				<CollectionFilter
					toolbar={<BranchCreateForm />}
					buttonLabel="Filters"
					key={documentId}
					params={params}
					update={update}
					fields={[
						{ name: "branchName", label: "Exact branch name" },
						statusField,
					]}
					sorts={branchSorts}
					label="branches"
				/>
				<CollectionResults
					query={query}
					label="branches"
					empty={
						<InfoDrawerEmpty
							emptyTitle="No branches match these filters."
							emptyDescription="Adjust your filters, or create a branch from your current work."
						/>
					}
				>
					{(items) => (
						<ul
							aria-label="Document branches"
							className="editor-history-list editor-history-branches"
						>
							{items.map((branch) => (
								<li key={branch.id}>
									<BranchCard branch={branch} />
								</li>
							))}
						</ul>
					)}
				</CollectionResults>
				<CollectionPagination
					className="editor-history-pagination mt-auto"
					data={query.data}
					pending={query.isFetching}
					onPage={setPage}
					label="branches"
				/>
			</InfoDrawerBody>
		</>
	);
};

export default Branches;
