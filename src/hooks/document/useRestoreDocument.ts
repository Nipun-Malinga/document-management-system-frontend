import APIService from '@/services/apiService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useRestoreDocument = (documentId: string) => {
  const queryClient = useQueryClient();
  const service = new APIService(`/documents/trash/restore/${documentId}`);

  return useMutation({
    mutationKey: ['trashed_documents_own'],
    mutationFn: () => service.post(),
    onSuccess: () => {
      const keys = [
        ['documents-own'],
        ['trashed_documents_own'],
        ['documentCount'],
        ['trashDocumentCount'],
        ['document-favorites-count'],
      ];
      keys.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
    },
    onError: () => {
      console.error('Failed to restore document');
    },
  });
};

export default useRestoreDocument;
