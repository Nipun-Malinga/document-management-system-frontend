interface Branch {
  id: string;
  documentId: string;
  branchName: string;
  createdAt: string;
  updatedAt: string;
}

export interface BranchResponse {
  data: Branch[];
}
