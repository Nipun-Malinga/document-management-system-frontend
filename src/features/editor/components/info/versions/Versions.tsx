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
import useDocumentVersions from "@/hooks/document/useDocumentVersions";
import useCollectionParams from "@/hooks/useCollectionParams";
import type { VersionParams } from "@/models/PageResponse";
import InfoDrawerBody from "../InfoDrawerBody";
import VersionCard from "./VersionCard";
import VersionCreateForm from "./VersionCreateForm";

const Versions = () => {
	const { documentId } = useParams();
	const { params, update, setPage } =
		useCollectionParams<VersionParams>(documentId);
	const query = useDocumentVersions(documentId ?? "", params);

	return (
		<>
			<DrawerHeader className="shrink-0 border-b px-5 pb-5 pt-0">
				<DrawerTitle>Versions</DrawerTitle>
				<DrawerDescription>
					Browse saved versions and create a snapshot of your current work.
				</DrawerDescription>
			</DrawerHeader>
			<InfoDrawerBody emptyTitle="Versions" emptyDescription="">
				<VersionCreateForm />
				<CollectionFilter
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
				<CollectionResults query={query} label="versions">
					{(items) =>
						items.map((version) => (
							<VersionCard version={version} key={version.id} />
						))
					}
				</CollectionResults>
				<CollectionPagination
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
