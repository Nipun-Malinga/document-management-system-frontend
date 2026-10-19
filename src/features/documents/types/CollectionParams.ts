import type { PageParams } from "@/shared/types/PageResponse";

export interface DocumentParams extends PageParams {
	title?: string;
	status?: "PUBLIC" | "PRIVATE";
	favorite?: boolean;
}

export interface SharedDocumentParams extends Omit<DocumentParams, "favorite"> {
	permission?: "READ_ONLY" | "READ_WRITE";
}

export interface BranchParams extends PageParams {
	branchName?: string;
	status?: "PUBLIC" | "PRIVATE";
}

export interface VersionParams extends Omit<DocumentParams, "favorite"> {
	branchId?: string;
}

export interface TrashBranchParams extends BranchParams {
	documentId?: string;
}

export interface CollaboratorParams extends PageParams {
	username?: string;
	email?: string;
	permission?: "READ_ONLY" | "READ_WRITE";
}

export interface TemplateParams extends PageParams {
	title?: string;
}
