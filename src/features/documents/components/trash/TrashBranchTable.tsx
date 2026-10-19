import { GitBranch } from "lucide-react";
import { useTrashedBranches } from "@/features/documents/hooks";
import type { TrashBranchParams } from "@/features/documents/types/CollectionParams";
import useCollectionParams from "@/shared/hooks/useCollectionParams";
import CollectionEmpty from "../collections/CollectionEmpty";
import CollectionFilters from "../collections/CollectionFilters";
import CollectionPagination from "../collections/CollectionPagination";
import CollectionResults from "../collections/CollectionResults";
import {
	branchSorts,
	statusField,
} from "../collections/collectionFilterOptions";
import hasCollectionFilters from "../collections/hasCollectionFilters";
import TrashTable from "./TrashTable";
import TrashTableRow from "./TrashTableRow";

const TrashBranchTable = () => {
	const { params, update, setPage } = useCollectionParams<TrashBranchParams>();
	const query = useTrashedBranches(params);
	return (
		<div className="flex min-w-0 flex-1 flex-col gap-5">
			<section
				aria-label="Trashed branches controls"
				className="min-w-0 shrink-0 rounded-2xl border bg-secondary/40 p-4 @min-[40rem]/collection:p-5"
			>
				<CollectionFilters
					className="my-0"
					params={params}
					update={update}
					fields={[
						{ name: "branchName", label: "Exact branch name" },
						statusField,
						{ name: "documentId", label: "Document ID" },
					]}
					sorts={branchSorts}
					label="trashed branches"
				/>
			</section>
			<CollectionResults
				query={query}
				label="trashed branches"
				empty={
					hasCollectionFilters(params) ? undefined : (
						<CollectionEmpty
							className="min-h-64 md:p-10"
							icon={GitBranch}
							title="No trashed branches"
							description="Branches you move to Trash appear here. You can restore them or delete them permanently."
						/>
					)
				}
			>
				{(items) => (
					<TrashTable label="Trashed branches" itemHeading="Branch">
						{items.map((trash) => (
							<TrashTableRow trash={trash} key={trash.id} />
						))}
					</TrashTable>
				)}
			</CollectionResults>
			<p className="max-w-prose shrink-0 text-xs leading-relaxed text-muted-foreground">
				Dates are reported by the server and may not reflect when an item was
				trashed.
			</p>
			<CollectionPagination
				className="mt-0"
				data={query.data}
				pending={query.isFetching}
				onPage={setPage}
				label="trashed branches"
			/>
		</div>
	);
};

export default TrashBranchTable;
