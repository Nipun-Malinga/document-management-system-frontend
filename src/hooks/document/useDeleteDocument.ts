import { refreshDocumentMutation } from './documentMutationCache';
import { getSession } from '@/states/sessionStore';
import APIService from '@/services/apiService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteDocument = (documentId: string) => {
  const epoch = getSession().epoch;
  const queryClient = useQueryClient();
  const service = new APIService(`/documents/trash/delete/${documentId}`);

  return useMutation({
    retry: false,
    mutationKey: ['trashed_documents_own'],
    mutationFn: () => service.delete(),
    onSuccess: async () => {
      await refreshDocumentMutation(queryClient, 'deleteDocument', documentId, epoch);
    },
  });
};

export default useDeleteDocument;
