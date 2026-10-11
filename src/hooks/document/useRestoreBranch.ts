import { useMutation, useQueryClient } from "@tanstack/react-query";
import APIService from "@/services/apiService";
import { getSession } from "@/states/sessionStore";
import { refreshDocumentMutation } from "./documentMutationCache";

const useRestoreBranch = (documentId: string, branchId: string) => {
	const epoch = getSession().epoch;
	const queryClient = useQueryClient();
	const service = new APIService(
		`/documents/trash/restore/${documentId}/branches/${branchId}`,
	);

	return useMutation({
		retry: false,
		mutationKey: ["trashed_branches_own"],
		mutationFn: () => service.post(),
		onSuccess: async () => {
			await refreshDocumentMutation(
				queryClient,
				"restoreBranch",
				documentId,
				epoch,
			);
		},
	});
};

export default useRestoreBranch;
