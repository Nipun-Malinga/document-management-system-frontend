import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getSession } from "@/features/auth/stores/sessionStore";
import type { VersionRequest } from "@/features/documents/types/Version";
import { createSoloSnapshot } from "@/features/editor/persistence/documentWorkflows";
import APIService from "@/services/apiService";
import { refreshDocumentMutation } from "./documentMutationCache";

const useCreateVersion = (documentId: string, branchId: string) => {
	const epoch = getSession().epoch;
	const service = new APIService<VersionRequest>(
		`/documents/${documentId}/branches/${branchId}/versions`,
	);
	const mutationFn = (data: VersionRequest) =>
		createSoloSnapshot(documentId, branchId, () => service.post(data));

	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ["create-version"],
		mutationFn: mutationFn,
		retry: false,
		onSuccess: async () => {
			await refreshDocumentMutation(
				queryClient,
				"createVersion",
				documentId,
				epoch,
			);
		},
	});
};

export default useCreateVersion;
