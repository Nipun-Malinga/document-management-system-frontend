import { useMutation, useQueryClient } from "@tanstack/react-query";
import APIService from "@/services/apiService";
import { getSession } from "@/states/sessionStore";
import { refreshDocumentMutation } from "./documentMutationCache";

const useTrashDocument = (documentId: string) => {
	const epoch = getSession().epoch;
	const queryClient = useQueryClient();
	const service = new APIService(`/documents/trash/${documentId}`);

	return useMutation({
		retry: false,
		mutationKey: ["documents", documentId],
		mutationFn: () => service.delete(),
		onSuccess: async () => {
			await refreshDocumentMutation(
				queryClient,
				"trashDocument",
				documentId,
				epoch,
			);
		},
	});
};

export default useTrashDocument;
