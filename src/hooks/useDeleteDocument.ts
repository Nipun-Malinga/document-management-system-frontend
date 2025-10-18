import { useMutation, useQueryClient } from '@tanstack/react-query';
import APIService from '../services/apiService';

export const useDeleteDocument = (documentId: string) => {
  const queryClient = useQueryClient();
  const service = new APIService(`/documents/${documentId}`);

  return useMutation({
    mutationKey: ['documents', documentId],
    mutationFn: () => service.delete(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents-own'] });
    },
    onError: () => {
        console.log("Failed to delete document");
    }
  });
};
