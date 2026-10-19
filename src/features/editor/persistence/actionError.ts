import axios from "axios";
import type { ProblemDetail } from "@/shared/types/ProblemDetail";

export const actionError = (
	error: unknown,
	fallback = "The operation failed. Your content and inputs are preserved.",
) => {
	const detail = axios.isAxiosError<ProblemDetail>(error)
		? error.response?.data?.detail
		: undefined;
	if (typeof detail === "string" && detail.trim()) return detail;
	return error instanceof Error ? error.message : fallback;
};
