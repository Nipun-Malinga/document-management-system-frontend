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
		<div className="flex min-w-0 flex-1 flex-col gap-5">
			<section
				aria-label="Trashed documents controls"
				className="min-w-0 shrink-0 rounded-2xl border bg-secondary/40 p-4 @min-[40rem]/collection:p-5"
			>
				<CollectionFilters
					className="my-0"
					params={params}
					update={update}
					fields={[{ name: "title", label: "Exact title" }, statusField]}
					sorts={documentSorts}
					label="trashed documents"
				/>
			</section>
			<CollectionResults
				query={query}
				label="trashed documents"
				empty={
					hasCollectionFilters(params) ? undefined : (
						<CollectionEmpty
							className="min-h-64 md:p-10"
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
