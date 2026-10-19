import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getSession } from "@/features/auth/stores/sessionStore";
import type { BranchRequest } from "@/features/documents/types/Branch";
import { createSoloSnapshot } from "@/features/editor/persistence/documentWorkflows";
import APIService from "@/services/apiService";
import { refreshDocumentMutation } from "./documentMutationCache";

const useCreateBranch = (documentId: string, branchId: string) => {
	const epoch = getSession().epoch;
	const service = new APIService<BranchRequest>(
		`/documents/${documentId}/branches/${branchId}`,
	);
	const mutateFn = (data: BranchRequest) =>
		createSoloSnapshot(documentId, branchId, () => service.post(data));

	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["create-branch", documentId, branchId],
		mutationFn: mutateFn,
		retry: false,
		onSuccess: async () => {
			await refreshDocumentMutation(
				queryClient,
				"createBranch",
				documentId,
				epoch,
			);
		},
	});
};

export default useCreateBranch;
