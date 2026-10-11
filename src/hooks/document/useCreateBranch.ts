import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSoloSnapshot } from "@/features/editor/persistence/documentWorkflows";
import type { BranchRequest } from "@/models/Branch";
import APIService from "@/services/apiService";
import { getSession } from "@/states/sessionStore";
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
