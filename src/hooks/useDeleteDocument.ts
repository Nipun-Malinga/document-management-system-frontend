import { useMutation, useQueryClient } from '@tanstack/react-query';
import APIService from '../services/apiService';

export const useDeleteDocument = (documentId: string) => {
  const queryClient = useQueryClient();
  const service = new APIService(`/documents/${documentId}`);

  return useMutation({
    mutationKey: ['documents', documentId],
    mutationFn: () => service.delete(),
    onSuccess: () => {
      const keys = [
        ['documents-own']
      ];

      keys.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
    },
    onError: () => {
      console.log('Failed to delete document');
    },
  });
};
