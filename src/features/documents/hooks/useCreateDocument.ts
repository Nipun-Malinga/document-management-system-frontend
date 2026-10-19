import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assertSession, getSession } from "@/features/auth/stores/sessionStore";
import type {
	Document,
	DocumentRequest,
} from "@/features/documents/types/Document";
import APIService from "@/services/apiService";
import { refreshDocumentMutation } from "./documentMutationCache";

const useCreateDocument = () => {
	const epoch = getSession().epoch;
	const queryClient = useQueryClient();
	const service = new APIService<DocumentRequest, Document>("/documents");

	return useMutation({
		retry: false,
		mutationKey: ["create-document"],
		mutationFn: (data: DocumentRequest) => service.post(data),
		onSuccess: async (response) => {
			assertSession(epoch);
			queryClient.setQueryData(["document", response.id], response);
			await refreshDocumentMutation(queryClient, "create", response.id, epoch);
		},
	});
};

export default useCreateDocument;
