export interface Folder {
	id: string;
	parentFolderId: string | null;
	name: string;
	createdAt: string;
}

export type FolderAction =
	| { type: "create"; parentFolderId: string | null; name: string }
	| { type: "rename"; folderId: string; name: string }
	| { type: "move"; folderId: string; parentFolderId: string | null }
	| { type: "delete"; folderId: string }
	| { type: "assignDocument"; documentId: string; folderId: string }
	| { type: "removeDocument"; documentId: string; folderId: string }
	| {
			type: "moveDocument";
			documentId: string;
			folderId: string;
			targetFolderId: string;
	  };
