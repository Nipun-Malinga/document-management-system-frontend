import APIService from '@/services/apiService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteDocument = (documentId: string) => {
  const queryClient = useQueryClient();
  const service = new APIService(`/documents/trash/delete/${documentId}`);

  return useMutation({
    mutationKey: ['trashed_documents_own'],
    mutationFn: () => service.delete(),
    onSuccess: () => {
      const keys = [
        ['documents-own'],
        ['trashed_documents_own'],
        ['documentCount'],
        ['trashDocumentCount']
      ];
      keys.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
    },
    onError: () => {
      console.log('Failed to delete document');
    },
  });
};

export default useDeleteDocument;
