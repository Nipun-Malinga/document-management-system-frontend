import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ContentRequest, ContentResponse } from "@/models/Content";
import APIService from "@/services/apiService";
import { assertSession, getSession } from "@/states/sessionStore";
import { refreshDocumentMutation } from "./documentMutationCache";

const useSaveDocumentContent = (documentId: string, branchId: string) => {
	const epoch = getSession().epoch;
	const queryClient = useQueryClient();

	const service = new APIService<ContentRequest>(
		`/documents/${documentId}/branches/${branchId}/content`,
	);

	const queryKey = ["branch-content", documentId, branchId];
	const mutationFn = (content: string) => {
		return service.put({ content: content });
	};

	return useMutation({
		mutationKey: queryKey,
		mutationFn: (content: string) => mutationFn(content),

		onSuccess: async (_response, content) => {
			assertSession(epoch);
			queryClient.setQueryData<ContentResponse>(queryKey, { content });
			await refreshDocumentMutation(queryClient, "save", documentId, epoch);
		},
		retry: false,
	});
};

export default useSaveDocumentContent;
