import type { PageResponse } from "./PageResponse";

export interface Branch {
	id: string;
	documentId: string;
	branchName: string;
	createdAt: string;
	updatedAt: string;
	trashed: boolean;
}

export type BranchResponse = PageResponse<Branch>;

export interface BranchRequest {
	branchName: string;
}
