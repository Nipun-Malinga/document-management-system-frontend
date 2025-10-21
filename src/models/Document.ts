export interface Document {
  id: string;
  title: string;
  ownerId: number;
  status: string;
  shared: boolean;
  branchCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentsResponse {
  data: Document[];
  hasNext: boolean;
  hasPrevious: boolean;
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}
