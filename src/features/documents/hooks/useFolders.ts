import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { assertSession, getSession } from "@/features/auth/stores/sessionStore";
import type { DocumentParams } from "@/features/documents/types/CollectionParams";
import type { Document } from "@/features/documents/types/Document";
import type { Folder, FolderAction } from "@/features/documents/types/Folder";
import APIService from "@/services/apiService";
import useCollectionQuery from "@/shared/hooks/useCollectionQuery";

export const useFolders = () => {
	const service = new APIService<Folder[]>("/documents/folders");
	return useQuery({
		queryKey: ["folders"],
		queryFn: async ({ signal }) => {
			const folders = await service.get({ signal });
			if (!Array.isArray(folders))
				throw new Error("The server returned an invalid folder list.");
			return folders;
		},
		staleTime: 60000,
		retry: false,
	});
};

export const useFolderDocuments = (
	folderId: string | null,
	params: DocumentParams,
) =>
	useCollectionQuery<Document, DocumentParams>(
		`/documents/folders/${folderId}`,
		["folder-documents", folderId ?? ""],
		params,
		{ enabled: Boolean(folderId) },
	);

export const useFolderMutation = () => {
	const client = useQueryClient();
	const epoch = getSession().epoch;
	return useMutation({
		retry: false,
		mutationFn: async (action: FolderAction): Promise<unknown> => {
			switch (action.type) {
				case "create":
					return new APIService<{ name: string }, Folder>(
						`/documents/folders${action.parentFolderId ? `/${action.parentFolderId}` : ""}`,
					).post({ name: action.name });
				case "rename":
					return new APIService<{ name: string }, Folder>(
						`/documents/folders/${action.folderId}`,
					).patch({ name: action.name });
				case "move":
					return new APIService<{ parentFolderId: string | null }, Folder>(
						`/documents/folders/${action.folderId}/move`,
					).patch({ parentFolderId: action.parentFolderId });
				case "delete":
					return new APIService<void>(
						`/documents/folders/${action.folderId}`,
					).delete();
				case "assignDocument":
					return new APIService<undefined, Document>(
						`/documents/${action.documentId}/folders/${action.folderId}`,
					).post();
				case "removeDocument":
					return new APIService<undefined, Document>(
						`/documents/${action.documentId}/folders/${action.folderId}`,
					).delete();
				case "moveDocument":
					return new APIService<{ targetFolderId: string }, Document>(
						`/documents/${action.documentId}/folders/${action.folderId}/move`,
					).patch({ targetFolderId: action.targetFolderId });
			}
		},
		onSuccess: async (_response, action) => {
			assertSession(epoch);
			if (action.type === "delete") {
				// The backend deletes documents, branches and versions throughout the subtree.
				for (const key of [
					"document",
					"branches",
					"versions",
					"branch-content",
					"version-content",
					"permissions",
					"collaborators",
				])
					client.removeQueries({ queryKey: [key] });
			}
			await Promise.all(
				[
					"folders",
					"folder-documents",
					"documents-own",
					"shared-with",
					"sidebar-stats",
					"trashed_documents_own",
					"trashed_branches_own",
					"documentCount",
					"document-favorites-count",
					"sharedWithCount",
					"trashDocumentCount",
					"trashBranchCount",
				].map((key) => client.invalidateQueries({ queryKey: [key] })),
			);
			assertSession(epoch);
		},
	});
};
