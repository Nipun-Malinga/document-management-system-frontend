import type { PageRequest } from './PageRequest';

export interface Document {
  id: string;
  title: string;
  ownerId: number;
  status: string;
  shared: boolean;
  mainBranchId: string;
  branchCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentsResponse extends PageRequest<Document> {}
