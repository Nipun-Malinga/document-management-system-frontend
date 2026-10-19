import { History } from "lucide-react";
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
	statusField,
	versionSorts,
} from "@/features/documents/components/collections/collectionFilterOptions";
import useDocumentVersions from "@/features/documents/hooks/useDocumentVersions";
import type { VersionParams } from "@/features/documents/types/CollectionParams";
import useCollectionParams from "@/shared/hooks/useCollectionParams";
import InfoDrawerBody, { InfoDrawerEmpty } from "../InfoDrawerBody";
import VersionCard from "./VersionCard";
import VersionCreateForm from "./VersionCreateForm";

const Versions = () => {
	const { documentId } = useParams();
	const { params, update, setPage } =
		useCollectionParams<VersionParams>(documentId);
	const query = useDocumentVersions(documentId ?? "", params);

	return (
		<>
			<DrawerHeader className="editor-history-header shrink-0 px-4 py-6 text-left sm:px-6">
				<div className="flex items-start justify-between gap-4">
					<div className="flex min-w-0 flex-col gap-2">
						<DrawerTitle>Versions</DrawerTitle>
						<DrawerDescription>
							Keep named snapshots of your work and revisit them anytime.
						</DrawerDescription>
					</div>
					<span aria-hidden="true" className="editor-history-symbol">
						<History />
					</span>
				</div>
			</DrawerHeader>
			<InfoDrawerBody emptyTitle="Versions" emptyDescription="">
				<CollectionFilter
					toolbar={<VersionCreateForm />}
					buttonLabel="Filters"
					key={documentId}
					params={params}
					update={update}
					fields={[
						{ name: "title", label: "Exact title" },
						statusField,
						{ name: "branchId", label: "Branch ID" },
					]}
					sorts={versionSorts}
					label="versions"
				/>
				<CollectionResults
					query={query}
					label="versions"
					empty={
						<InfoDrawerEmpty
							emptyTitle="No versions match these filters."
							emptyDescription="Adjust your filters, or save your first version of this document."
						/>
					}
				>
					{(items) => (
						<ul
							aria-label="Document versions"
							className="editor-history-list editor-history-versions"
						>
							{items.map((version) => (
								<li key={version.id}>
									<VersionCard version={version} />
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
					label="versions"
				/>
			</InfoDrawerBody>
		</>
	);
};

export default Versions;
