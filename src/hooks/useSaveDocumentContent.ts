import { useQueryClient, useMutation } from "@tanstack/react-query";
import type { ContentRequest } from "../models/Content";
import APIService from "../services/apiService";

export const useSaveDocumentContent = (
  documentId: string,
  branchName: string
) => {
  const service = new APIService<ContentRequest>(
    `/documents/${documentId}/branches/${branchName}/content`
  );

  const queryClient = useQueryClient();

  const queryKey = ['branches', documentId, 'branch', branchName];
  return useMutation({
    mutationKey: queryKey,
    mutationFn: (content: string) => service.put({ content: content }),
    onSuccess: () => {
      queryClient.setQueryData(queryKey, (content: string) => {
        return { content, completed: true };
      });
    },
    onError: () => {
      console.error('Failed to update document content');
    },
  });
};
