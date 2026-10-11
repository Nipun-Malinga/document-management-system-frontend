import type { PageResponse } from "@/models/PageResponse";

export const pageOf = <T>(
	content: T[],
	page = 0,
	totalElements = content.length,
	size = 20,
): PageResponse<T> => {
	const totalPages = Math.ceil(totalElements / size);
	return {
		content,
		page,
		size,
		totalElements,
		totalPages,
		first: page === 0,
		last: page + 1 >= totalPages,
		hasNext: page + 1 < totalPages,
		hasPrevious: page > 0,
		empty: content.length === 0,
	};
};
