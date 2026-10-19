import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assertSession, getSession } from "@/features/auth/stores/sessionStore";
import type {
	Document,
	UpdateDocumentRequest,
} from "@/features/documents/types/Document";
import APIService from "@/services/apiService";
import { refreshDocumentMutation } from "./documentMutationCache";

const useUpdateDocumentInfo = (documentId: string) => {
	const epoch = getSession().epoch;
	const service = new APIService<UpdateDocumentRequest, Document>(
		`/documents/${documentId}`,
	);
	const mutateFn = (data: UpdateDocumentRequest) => service.put(data);

	const queryClient = useQueryClient();

	return useMutation({
		retry: false,
		mutationKey: ["documentInfo", documentId],
		mutationFn: mutateFn,
		onSuccess: async (response) => {
			assertSession(epoch);
			queryClient.setQueryData(["document", documentId], response);
			await refreshDocumentMutation(queryClient, "rename", documentId, epoch);
		},
	});
};

export default useUpdateDocumentInfo;
