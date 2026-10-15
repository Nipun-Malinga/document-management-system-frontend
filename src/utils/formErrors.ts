import axios from "axios";
import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { actionError } from "@/features/editor/persistence/actionError";
import type { ProblemDetail } from "@/models/ProblemDetail";

export const applyFormError = <T extends FieldValues>(
	error: unknown,
	setError: UseFormSetError<T>,
	fields: readonly Path<T>[],
) => {
	if (axios.isAxiosError<ProblemDetail>(error)) {
		const problem = error.response?.data;
		for (const field of fields) {
			const message = problem?.errors?.[field];
			if (typeof message === "string" && message.trim())
				setError(field, { type: "server", message });
		}
		if (error.response?.status === 409) {
			const detail = typeof problem?.detail === "string" ? problem.detail : "";

			const field = /^username\b/i.test(detail)
				? "username"
				: /^email\b/i.test(detail)
					? "email"
					: null;
			const path = fields.find((name) => name === field);
			if (path) setError(path, { type: "server", message: detail });
			return (
				detail ||
				"This account information is already registered. Check your email and username."
			);
		}
		if (error.response?.status === 401) return "Invalid email or password.";
	}
	return actionError(error);
};
