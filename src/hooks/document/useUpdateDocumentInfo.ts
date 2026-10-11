import { refreshDocumentMutation } from './documentMutationCache';
import { assertSession, getSession } from '@/states/sessionStore';
import type { Document, UpdateDocumentRequest } from '@/models/Document';
import APIService from '@/services/apiService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useUpdateDocumentInfo = (documentId: string) => {
  const epoch = getSession().epoch;
  const service = new APIService<UpdateDocumentRequest, Document>(
    `/documents/${documentId}`
  );
  const mutateFn = (data: UpdateDocumentRequest) => service.put(data);

  const queryClient = useQueryClient();

  return useMutation({
    retry: false,
    mutationKey: ['documentInfo', documentId],
    mutationFn: mutateFn,
    onSuccess: async (response) => {
      assertSession(epoch);
      queryClient.setQueryData(['document', documentId], response);
      await refreshDocumentMutation(queryClient, 'rename', documentId, epoch);
    },
  });
};

export default useUpdateDocumentInfo;
