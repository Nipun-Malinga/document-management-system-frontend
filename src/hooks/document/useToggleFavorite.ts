import { refreshDocumentMutation } from './documentMutationCache';
import { getSession } from '@/states/sessionStore';
import APIService from '@/services/apiService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useToggleFavorite = (documentId: string) => {
  const epoch = getSession().epoch;
  const queryClient = useQueryClient();
  const service = new APIService(`/documents/${documentId}/favorites/toggle`);

  return useMutation({
    retry: false,
    mutationKey: ['document-favorites'],
    mutationFn: () => service.post(),
    onSuccess: async () => {
      await refreshDocumentMutation(queryClient, 'favorite', documentId, epoch);
    },
  });
};

export default useToggleFavorite;
