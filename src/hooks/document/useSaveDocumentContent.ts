import { assertSession, getSession } from '@/states/sessionStore';
import type { ContentRequest, ContentResponse } from '@/models/Content';
import APIService from '@/services/apiService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useSaveDocumentContent = (
  documentId: string,
  branchId: string
) => {
  const epoch = getSession().epoch;
  const queryClient = useQueryClient();

  const service = new APIService<ContentRequest>(
    `/documents/${documentId}/branches/${branchId}/content`
  );

  const queryKey = ['branch-content', documentId, branchId];
  const mutationFn = (content: string) => {
    return service.put({ content: content });
  };

  return useMutation({
    mutationKey: queryKey,
    mutationFn: (content: string) => mutationFn(content),

    onSuccess: (_response, content) => {
      assertSession(epoch);
      queryClient.setQueryData<ContentResponse>(queryKey, { content });
    },
    retry: false,
  });
};


export default useSaveDocumentContent;
