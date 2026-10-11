import { Table } from "@/components";
import { useTrashedBranches } from "@/hooks/document";
import useCollectionParams from "@/hooks/useCollectionParams";
import type { TrashBranchParams } from "@/models/PageResponse";
import CollectionFilters from "../collections/CollectionFilters";
import CollectionPagination from "../collections/CollectionPagination";
import CollectionResults from "../collections/CollectionResults";
import {
	branchSorts,
	statusField,
} from "../collections/collectionFilterOptions";
import TrashTableRow from "./TrashTableRow";

const TrashBranchTable = () => {
	const { params, update, setPage } = useCollectionParams<TrashBranchParams>();
	const query = useTrashedBranches(params);
	return (
		<div className="px-3">
			<CollectionFilters
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
			<CollectionResults query={query} label="trashed branches">
				{(items) => (
					<Table titles={["Title", "Reported Date", "Actions"]}>
						{items.map((trash) => (
							<TrashTableRow trash={trash} key={trash.id} />
						))}
					</Table>
				)}
			</CollectionResults>
			<p className="my-2 text-sm text-muted-foreground">
				Dates are reported by the server and may not reflect when an item was
				trashed.
			</p>
			<CollectionPagination
				data={query.data}
				pending={query.isFetching}
				onPage={setPage}
				label="trashed branches"
			/>
		</div>
	);
};

export default TrashBranchTable;
