import { useMutation, useQueryClient } from "@tanstack/react-query";
import APIService from "@/services/apiService";
import { getSession } from "@/states/sessionStore";
import { refreshDocumentMutation } from "./documentMutationCache";

const useTrashBranch = (documentId: string, branchId: string) => {
	const epoch = getSession().epoch;
	const service = new APIService(
		`/documents/trash/${documentId}/branches/${branchId}`,
	);
	const mutateFn = () => service.delete();
	const queryClient = useQueryClient();

	return useMutation({
		retry: false,
		mutationKey: ["trashBranch", branchId],
		mutationFn: mutateFn,
		onSuccess: async () => {
			await refreshDocumentMutation(
				queryClient,
				"trashBranch",
				documentId,
				epoch,
			);
		},
	});
};

export default useTrashBranch;
