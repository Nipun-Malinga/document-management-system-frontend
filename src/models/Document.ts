import type { PageRequest } from './PageRequest';

type status = 'PUBLIC' | 'PRIVATE';

export interface Document {
  id: string;
  title: string;
  ownerId: number;
  status: status;
  shared: boolean;
  mainBranchId: string;
  branchCount: number;
  createdAt: string;
  updatedAt: string;
  trashed: boolean;
  favorite: boolean;
}

export interface DocumentsResponse extends PageRequest<Document> {}
export interface DocumentRequest extends Pick<Document, 'title' | 'status'> {
  templateId: number;
}
export interface UpdateDocumentRequest extends Pick<Document, 'title'> {}
