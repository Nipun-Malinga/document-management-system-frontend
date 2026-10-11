import axios from "axios";
import type { PageParams, PageResponse } from "@/models/PageResponse";
import type { ProblemDetail } from "@/models/ProblemDetail";

export const normalizePageParams = <P extends PageParams>(params: P) => {
	const normalized: Record<string, string | number | boolean> = {};
	for (const [key, value] of Object.entries(params)) {
		if (key === "page" || key === "size" || key === "sort") continue;
		if (typeof value === "string" && value.trim())
			normalized[key] = value.trim();
		else if (typeof value === "boolean") normalized[key] = value;
	}
	normalized.page =
		typeof params.page === "number" && Number.isFinite(params.page)
			? Math.max(0, Math.floor(params.page))
			: 0;
	normalized.size =
		typeof params.size === "number" && Number.isFinite(params.size)
			? Math.min(50, Math.max(1, Math.floor(params.size)))
			: 20;
	normalized.sort = params.sort?.trim() || "id,asc";
	return normalized;
};

// Reject obsolete/malformed collection contracts rather than displaying a false empty state.
export const parsePageResponse = <T>(
	value: PageResponse<T>,
): PageResponse<T> => {
	if (
		!value ||
		!Array.isArray(value.content) ||
		!(["page", "size", "totalElements", "totalPages"] as const).every((key) => {
			const field = value[key];
			return Number.isSafeInteger(field) && field >= (key === "size" ? 1 : 0);
		}) ||
		!(["first", "last", "hasNext", "hasPrevious", "empty"] as const).every(
			(key) => typeof value[key] === "boolean",
		)
	) {
		throw new Error(
			"The server returned an invalid collection. Please try again.",
		);
	}
	return value;
};

export const collectionErrorMessage = (error: unknown, label: string) => {
	if (axios.isAxiosError<ProblemDetail>(error)) {
		const status = error.response?.status;
		if (status === 403) return `You do not have permission to view ${label}.`;
		if (status === 404) return `${label} could not be found.`;
		const detail = error.response?.data?.detail;
		if (typeof detail === "string" && detail.trim()) return detail;
	}
	return `Could not load ${label}. Please try again.`;
};
