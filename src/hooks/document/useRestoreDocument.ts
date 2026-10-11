import { refreshDocumentMutation } from './documentMutationCache';
import { getSession } from '@/states/sessionStore';
import APIService from '@/services/apiService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useRestoreDocument = (documentId: string) => {
  const epoch = getSession().epoch;
  const queryClient = useQueryClient();
  const service = new APIService(`/documents/trash/restore/${documentId}`);

  return useMutation({
    retry: false,
    mutationKey: ['trashed_documents_own'],
    mutationFn: () => service.post(),
    onSuccess: async () => {
      await refreshDocumentMutation(queryClient, 'restoreDocument', documentId, epoch);
    },
  });
};

export default useRestoreDocument;
