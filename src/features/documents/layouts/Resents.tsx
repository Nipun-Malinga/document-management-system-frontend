import { Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import useRecentDocuments, {
	recentDocumentParams,
} from "@/features/documents/hooks/useRecentDocuments";
import type { DocumentParams } from "@/features/documents/types/CollectionParams";
import useCollectionParams from "@/shared/hooks/useCollectionParams";
import CollectionEmpty from "../components/collections/CollectionEmpty";
import CollectionFilters from "../components/collections/CollectionFilters";
import CollectionPage from "../components/collections/CollectionPage";
import CollectionPagination from "../components/collections/CollectionPagination";
import CollectionResults from "../components/collections/CollectionResults";
import { statusField } from "../components/collections/collectionFilterOptions";
import hasCollectionFilters from "../components/collections/hasCollectionFilters";
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
		<CollectionPage
			title="Recents"
			description="Your documents, ordered by their latest update."
			count={query.data?.totalElements}
			filters={
				<div className="flex flex-col gap-4">
					<DocumentSearch
						title={params.title}
						onSearch={(title) => update({ title })}
					/>
					<CollectionFilters
						className="my-0"
						params={params}
						update={update}
						fields={[statusField]}
						sorts={[[recentDocumentParams.sort, "Recently updated"]]}
						label="recent documents"
					/>
				</div>
			}
		>
			<CollectionResults
				fill
				query={query}
				label="recent documents"
				empty={
					hasCollectionFilters(params) ? undefined : (
						<CollectionEmpty
							icon={Clock}
							title="No recent documents yet"
							description="Create your first document to start building your workspace. Your latest updates will appear here."
							action={
								<Button asChild variant="outline">
									<Link to="/dashboard/home#templates">Create a document</Link>
								</Button>
							}
						/>
					)
				}
			>
				{(items) => (
					<DocumentGrid>
						{items.map((document) => (
							<DocumentCard key={document.id} document={document} />
						))}
					</DocumentGrid>
				)}
			</CollectionResults>
			<CollectionPagination
				className="mt-0"
				data={query.data}
				pending={query.isFetching}
				onPage={setPage}
				label="recent documents"
			/>
		</CollectionPage>
	);
};
export default Resents;
