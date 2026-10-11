import { Breadcrumb, Container } from "@/components";
import { resentsBreadcrumb } from "@/data/breadcrumb/HomeBreadcrumbs";
import useRecentDocuments, {
	recentDocumentParams,
} from "@/hooks/document/useRecentDocuments";
import useCollectionParams from "@/hooks/useCollectionParams";
import type { DocumentParams } from "@/models/PageResponse";
import CollectionFilters from "../components/collections/CollectionFilters";
import CollectionPagination from "../components/collections/CollectionPagination";
import CollectionResults from "../components/collections/CollectionResults";
import { statusField } from "../components/collections/collectionFilterOptions";
import DocumentCard from "../components/DocumentCard";
import DocumentGrid from "../components/DocumentGrid";
import DocumentSearch from "../components/DocumentSearch";

const Resents = () => {
	const { params, update, setPage } = useCollectionParams<DocumentParams>(
		"",
		recentDocumentParams,
	);
	const query = useRecentDocuments(params);
	return (
		<Container>
			<Breadcrumb links={resentsBreadcrumb} />
			<p className="my-3 text-sm text-muted-foreground">
				Your owned, non-trashed documents, ordered by latest update. This is not
				view history.
			</p>
			<DocumentSearch
				title={params.title}
				onSearch={(title) => update({ title })}
			/>
			<CollectionFilters
				params={params}
				update={update}
				fields={[statusField]}
				sorts={[[recentDocumentParams.sort, "Recently updated"]]}
				label="recent documents"
			/>
			<CollectionResults query={query} label="recent documents">
				{(items) => (
					<DocumentGrid>
						{items.map((document) => (
							<DocumentCard key={document.id} document={document} />
						))}
					</DocumentGrid>
				)}
			</CollectionResults>
			<CollectionPagination
				data={query.data}
				pending={query.isFetching}
				onPage={setPage}
				label="recent documents"
			/>
		</Container>
	);
};
export default Resents;
