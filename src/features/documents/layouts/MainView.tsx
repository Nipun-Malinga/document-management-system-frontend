import { FolderOpen } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { useUserDocuments } from "@/features/documents/hooks";
import {
	useFolderDocuments,
	useFolders,
} from "@/features/documents/hooks/useFolders";
import type { DocumentParams } from "@/features/documents/types/CollectionParams";
import useCollectionParams from "@/shared/hooks/useCollectionParams";
import CollectionFilter from "../components/collections/CollectionFilter";
import CollectionPagination from "../components/collections/CollectionPagination";
import CollectionResults from "../components/collections/CollectionResults";
import {
	documentSorts,
	statusField,
} from "../components/collections/collectionFilterOptions";
import DocumentCard from "../components/DocumentCard";
import DocumentGrid from "../components/DocumentGrid";
import DocumentSearch from "../components/DocumentSearch";
import FolderBrowser from "../components/folders/FolderBrowser";
import WorkspaceHome from "../components/WorkspaceHome";

const MainView = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const folderId = searchParams.get("folder");
	const { params, update, setPage } = useCollectionParams<DocumentParams>(
		folderId ?? "all",
	);
	const allDocuments = useUserDocuments(params, !folderId);
	const folderDocuments = useFolderDocuments(folderId, params);
	const folders = useFolders();
	const currentFolder = folders.data?.find((folder) => folder.id === folderId);
	const query = folderId ? folderDocuments : allDocuments;

	return (
		<WorkspaceHome
			folders={
				<FolderBrowser
					folderId={folderId}
					onNavigate={(id) => {
						const next = new URLSearchParams(searchParams);
						if (id) next.set("folder", id);
						else next.delete("folder");
						setSearchParams(next);
					}}
				/>
			}
			documentsTitle={
				folderId
					? `Documents in ${currentFolder?.name ?? "folder"}`
					: "All documents"
			}
			resultCount={query.data?.totalElements}
		>
			<CollectionFilter
				toolbar={
					<DocumentSearch
						title={params.title}
						onSearch={(title) => update({ title })}
					/>
				}
				params={params}
				update={update}
				fields={[
					{ name: "title", label: "Title" },
					statusField,
					{
						name: "favorite",
						label: "Favorite",
						options: [
							["true", "Yes"],
							["false", "No"],
						],
					},
				]}
				sorts={documentSorts}
				label="documents"
			/>
			<CollectionResults
				query={query}
				label="documents"
				empty={
					Object.entries(params).some(
						([key, value]) =>
							!["page", "size", "sort"].includes(key) &&
							value !== undefined &&
							value !== "",
					) ? undefined : (
						<Empty className="min-h-64 rounded-xl border bg-card p-6 md:p-10">
							<EmptyHeader>
								<EmptyMedia variant="icon">
									<FolderOpen aria-hidden="true" />
								</EmptyMedia>
								<EmptyTitle>
									{folderId
										? "No documents in this folder"
										: "No documents yet"}
								</EmptyTitle>
								<EmptyDescription>
									{folderId
										? "Move documents here from All documents using their folder actions."
										: "Select New document to choose a template and create your first document. Your work will appear here."}
								</EmptyDescription>
							</EmptyHeader>
						</Empty>
					)
				}
			>
				{(items) => (
					<DocumentGrid>
						{items.map((document) => (
							<DocumentCard
								document={document}
								key={document.id}
								folderId={folderId}
							/>
						))}
					</DocumentGrid>
				)}
			</CollectionResults>
			<CollectionPagination
				className="mt-0"
				data={query.data}
				pending={query.isFetching}
				onPage={setPage}
				label="documents"
			/>
		</WorkspaceHome>
	);
};

export default MainView;
