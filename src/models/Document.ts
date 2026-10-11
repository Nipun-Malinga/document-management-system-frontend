import type { PageResponse } from './PageResponse';

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

export type DocumentsResponse = PageResponse<Document>;
export interface DocumentRequest extends Pick<Document, 'title' | 'status'> {
  templateId: number;
}
export type UpdateDocumentRequest = Pick<Document, 'title'>;
