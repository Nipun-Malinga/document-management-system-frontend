import APIService from '@/services/apiService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useToggleFavorite = (documentId: string) => {
  const queryClient = useQueryClient();
  const service = new APIService(`/documents/${documentId}/favorites/toggle`);

  return useMutation({
    mutationKey: ['document-favorites'],
    mutationFn: () => service.post(),
    onSuccess: () => {
      const keys = [['document-favorites-count'], ['documents-own']];
      keys.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
    },
  });
};

export default useToggleFavorite;
