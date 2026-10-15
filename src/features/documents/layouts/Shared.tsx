import { Users } from "lucide-react";
import { useUserSharedDocuments } from "@/hooks/document";
import useCollectionParams from "@/hooks/useCollectionParams";
import type { SharedDocumentParams } from "@/models/PageResponse";
import CollectionEmpty from "../components/collections/CollectionEmpty";
import CollectionFilters from "../components/collections/CollectionFilters";
import CollectionPage from "../components/collections/CollectionPage";
import CollectionPagination from "../components/collections/CollectionPagination";
import CollectionResults from "../components/collections/CollectionResults";
import {
	documentSorts,
	permissionField,
	statusField,
} from "../components/collections/collectionFilterOptions";
import hasCollectionFilters from "../components/collections/hasCollectionFilters";
import DocumentCard from "../components/DocumentCard";
import DocumentGrid from "../components/DocumentGrid";

const Shared = () => {
	const { params, update, setPage } =
		useCollectionParams<SharedDocumentParams>();
	const query = useUserSharedDocuments(params);

	return (
		<CollectionPage
			title="Shared With Me"
			description="Documents shared with you. Find the right work by title, visibility, or your permission."
			count={query.data?.totalElements}
			filters={
				<CollectionFilters
					className="my-0"
					params={params}
					update={update}
					fields={[
						{ name: "title", label: "Exact title" },
						statusField,
						permissionField,
					]}
					sorts={documentSorts}
					label="shared documents"
				/>
			}
		>
			<CollectionResults
				fill
				query={query}
				label="shared documents"
				empty={
					hasCollectionFilters(params) ? undefined : (
						<CollectionEmpty
							icon={Users}
							title="Nothing shared with you yet"
							description="When someone gives you access to a document, it will appear here."
						/>
					)
				}
			>
				{(items) => (
					<DocumentGrid>
						{items.map((document) => (
							<DocumentCard document={document} key={document.id} />
						))}
					</DocumentGrid>
				)}
			</CollectionResults>
			<CollectionPagination
				className="mt-0"
				data={query.data}
				pending={query.isFetching}
				onPage={setPage}
				label="shared documents"
			/>
		</CollectionPage>
	);
};

export default Shared;
