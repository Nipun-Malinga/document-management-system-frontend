export interface PageRequest<T> {
  data: T[];
  hasNext: boolean;
  hasPrevious: boolean;
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}
