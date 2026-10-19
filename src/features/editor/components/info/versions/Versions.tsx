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
			<DrawerHeader className="shrink-0 gap-2 border-b bg-card px-4 py-5 text-left sm:px-6">
				<DrawerTitle className="flex items-center gap-2">
					<History
						aria-hidden="true"
						className="size-5 shrink-0 text-primary"
					/>
					Versions
				</DrawerTitle>
				<DrawerDescription>
					Browse saved versions and create a snapshot of your current work.
				</DrawerDescription>
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
							emptyDescription=""
						/>
					}
				>
					{(items) => (
						<ul className="flex min-w-0 flex-col gap-3">
							{items.map((version) => (
								<li key={version.id}>
									<VersionCard version={version} />
								</li>
							))}
						</ul>
					)}
				</CollectionResults>
				<CollectionPagination
					className="mt-auto"
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
