import { Bookmark } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useUserDocuments } from "@/features/documents/hooks";
import type { DocumentParams } from "@/features/documents/types/CollectionParams";
import useCollectionParams from "@/shared/hooks/useCollectionParams";
import CollectionEmpty from "../components/collections/CollectionEmpty";
import CollectionFilters from "../components/collections/CollectionFilters";
import CollectionPage from "../components/collections/CollectionPage";
import CollectionPagination from "../components/collections/CollectionPagination";
import CollectionResults from "../components/collections/CollectionResults";
import {
	documentSorts,
	statusField,
} from "../components/collections/collectionFilterOptions";
import hasCollectionFilters from "../components/collections/hasCollectionFilters";
import DocumentCard from "../components/DocumentCard";
import DocumentGrid from "../components/DocumentGrid";

const Quick = () => {
	const { params, update, setPage } = useCollectionParams<DocumentParams>("", {
		favorite: true,
	});
	const query = useUserDocuments(params);

	return (
		<CollectionPage
			title="Quick Access"
			description="Keep your most useful documents close. Your bookmarked documents appear here."
			count={query.data?.totalElements}
			filters={
				<CollectionFilters
					className="my-0"
					params={params}
					update={update}
					fields={[{ name: "title", label: "Exact title" }, statusField]}
					sorts={documentSorts}
					label="favorites"
				/>
			}
		>
			<CollectionResults
				fill
				query={query}
				label="favorites"
				empty={
					hasCollectionFilters(params, ["favorite"]) ? undefined : (
						<CollectionEmpty
							icon={Bookmark}
							title="No bookmarks yet"
							description="Bookmark a document from Home to find it here whenever you need it."
							action={
								<Button asChild variant="outline">
									<Link to="/dashboard/home">Browse documents</Link>
								</Button>
							}
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
				label="favorites"
			/>
		</CollectionPage>
	);
};

export default Quick;
