import { FolderOpen } from "lucide-react";
import { Breadcrumb, Container } from "@/components";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { sharedWithMeBreadcrumb } from "@/data/breadcrumb/HomeBreadcrumbs";
import { useUserSharedDocuments } from "@/hooks/document";
import useCollectionParams from "@/hooks/useCollectionParams";
import type { SharedDocumentParams } from "@/models/PageResponse";
import CollectionFilters from "../components/collections/CollectionFilters";
import CollectionPagination from "../components/collections/CollectionPagination";
import CollectionResults from "../components/collections/CollectionResults";
import {
	documentSorts,
	permissionField,
	statusField,
} from "../components/collections/collectionFilterOptions";
import DocumentCard from "../components/DocumentCard";
import DocumentGrid from "../components/DocumentGrid";

const Shared = () => {
	const { params, update, setPage } =
		useCollectionParams<SharedDocumentParams>();
	const query = useUserSharedDocuments(params);

	return (
		<Container>
			<Breadcrumb links={sharedWithMeBreadcrumb} />
			<CollectionFilters
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
			<CollectionResults
				query={query}
				label="shared documents"
				empty={
					Object.entries(params).some(
						([key, value]) =>
							!["page", "size", "sort"].includes(key) &&
							value !== undefined &&
							value !== "",
					) ? undefined : (
						<Empty className="mt-5 md:mt-10 lg:mt-20">
							<EmptyHeader>
								<EmptyMedia variant="icon">
									<FolderOpen />
								</EmptyMedia>
								<EmptyTitle>No Documents Shared With You Yet</EmptyTitle>
								<EmptyDescription>
									You don't have any shared documents yet
								</EmptyDescription>
							</EmptyHeader>
						</Empty>
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
				data={query.data}
				pending={query.isFetching}
				onPage={setPage}
				label="shared documents"
			/>
		</Container>
	);
};

export default Shared;
