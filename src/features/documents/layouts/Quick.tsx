import { BookmarkCheck } from "lucide-react";
import { Breadcrumb, Container } from "@/components";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { quickAccessBreadcrumb } from "@/data/breadcrumb/HomeBreadcrumbs";
import { useUserDocuments } from "@/hooks/document";
import useCollectionParams from "@/hooks/useCollectionParams";
import type { DocumentParams } from "@/models/PageResponse";
import CollectionFilters from "../components/collections/CollectionFilters";
import CollectionPagination from "../components/collections/CollectionPagination";
import CollectionResults from "../components/collections/CollectionResults";
import {
	documentSorts,
	statusField,
} from "../components/collections/collectionFilterOptions";
import DocumentCard from "../components/DocumentCard";
import DocumentGrid from "../components/DocumentGrid";

const Quick = () => {
	const { params, update, setPage } = useCollectionParams<DocumentParams>("", {
		favorite: true,
	});
	const query = useUserDocuments(params);

	return (
		<Container>
			<Breadcrumb links={quickAccessBreadcrumb} />

			<CollectionFilters
				params={params}
				update={update}
				fields={[{ name: "title", label: "Exact title" }, statusField]}
				sorts={documentSorts}
				label="favorites"
			/>
			<CollectionResults
				query={query}
				label="favorites"
				empty={
					Object.entries(params).some(
						([key, value]) =>
							!["page", "size", "sort", "favorite"].includes(key) &&
							value !== undefined &&
							value !== "",
					) ? undefined : (
						<Empty className="mt-20">
							<EmptyHeader>
								<EmptyMedia variant="icon">
									<BookmarkCheck />
								</EmptyMedia>
								<EmptyTitle>No Favorites Yet.</EmptyTitle>
								<EmptyDescription>
									You don't have any favorites yet.
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
				label="favorites"
			/>
		</Container>
	);
};

export default Quick;
