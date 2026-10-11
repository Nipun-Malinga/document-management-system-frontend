import { useMutation, useQueryClient } from "@tanstack/react-query";
import APIService from "@/services/apiService";
import { getSession } from "@/states/sessionStore";
import { refreshDocumentMutation } from "./documentMutationCache";

const useDeleteBranch = (documentId: string, branchId: string) => {
	const epoch = getSession().epoch;
	const queryClient = useQueryClient();
	const service = new APIService(
		`/documents/trash/delete/${documentId}/branches/${branchId}`,
	);

	return useMutation({
		retry: false,
		mutationKey: ["trashed_branches_own"],
		mutationFn: () => service.delete(),
		onSuccess: async () => {
			await refreshDocumentMutation(
				queryClient,
				"deleteBranch",
				documentId,
				epoch,
				branchId,
			);
		},
	});
};

export default useDeleteBranch;
