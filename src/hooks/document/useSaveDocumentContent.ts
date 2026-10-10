import type { ContentRequest, ContentResponse } from '@/models/Content';
import APIService from '@/services/apiService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useSaveDocumentContent = (
  documentId: string,
  branchId: string
) => {
  const queryClient = useQueryClient();

  const service = new APIService<ContentRequest>(
    `/documents/${documentId}/branches/${branchId}/content`
  );

  const queryKey = ['branches', documentId, 'branch', branchId];
  const mutationFn = (content: string) => {
    return service.put({ content: content });
  };

  return useMutation({
    mutationKey: queryKey,
    mutationFn: (content: string) => mutationFn(content),

    onSuccess: (_response, content) => {
      queryClient.setQueryData<ContentResponse>(queryKey, { content });
    },
    onError: () => {
      console.error('Failed to update document content');
    },
  });
};


export default useSaveDocumentContent;
