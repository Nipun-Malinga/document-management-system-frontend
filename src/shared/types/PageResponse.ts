export interface PageResponse<T> {
	content: T[];
	page: number;
	size: number;
	totalElements: number;
	totalPages: number;
	first: boolean;
	last: boolean;
	hasNext: boolean;
	hasPrevious: boolean;
	empty: boolean;
}

export interface PageParams {
	page?: number;
	size?: number;
	sort?: string;
}
