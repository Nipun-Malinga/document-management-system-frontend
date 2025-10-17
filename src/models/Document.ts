interface Document {
  id: string;
  title: string;
  ownerId: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentRequest {
  data: Document[];
  hasNext: boolean;
  hasPrevious: boolean;
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}
