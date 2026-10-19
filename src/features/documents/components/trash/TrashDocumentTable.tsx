import { Trash2 } from "lucide-react";
import { useTrashedDocuments } from "@/features/documents/hooks";
import type { DocumentParams } from "@/features/documents/types/CollectionParams";
import useCollectionParams from "@/shared/hooks/useCollectionParams";
import CollectionEmpty from "../collections/CollectionEmpty";
import CollectionFilters from "../collections/CollectionFilters";
import CollectionPagination from "../collections/CollectionPagination";
import CollectionResults from "../collections/CollectionResults";
import {
	documentSorts,
	statusField,
} from "../collections/collectionFilterOptions";
import hasCollectionFilters from "../collections/hasCollectionFilters";
import TrashTable from "./TrashTable";
import TrashTableRow from "./TrashTableRow";

const TrashDocumentTable = () => {
	const { params, update, setPage } =
		useCollectionParams<Omit<DocumentParams, "favorite">>();
	const query = useTrashedDocuments(params);
	return (
		<div className="flex min-h-0 min-w-0 flex-1 flex-col gap-4">
			<div className="shrink-0 rounded-xl border bg-card p-4">
				<CollectionFilters
					className="my-0"
					params={params}
					update={update}
					fields={[{ name: "title", label: "Exact title" }, statusField]}
					sorts={documentSorts}
					label="trashed documents"
				/>
			</div>
			<CollectionResults
				fill
				query={query}
				label="trashed documents"
				empty={
					hasCollectionFilters(params) ? undefined : (
						<CollectionEmpty
							icon={Trash2}
							title="No trashed documents"
							description="Documents you move to Trash appear here. You can restore them or delete them permanently."
						/>
					)
				}
			>
				{(items) => (
					<TrashTable label="Trashed documents" itemHeading="Document">
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
				label="trashed documents"
			/>
		</div>
	);
};

export default TrashDocumentTable;
