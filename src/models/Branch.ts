export interface Branch {
  id: string;
  documentId: string;
  branchName: string;
  createdAt: string;
  updatedAt: string;
  trashed: boolean
}

export interface BranchResponse {
  data: Branch[];
}
