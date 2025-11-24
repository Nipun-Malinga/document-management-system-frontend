import type { ShareDocumentRequest } from '@/models/SharedDocument';
import APIService from '@/services/apiService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useShareDocument = (documentId: string) => {
  const service = new APIService<ShareDocumentRequest>(
    `/documents/${documentId}/share`
  );
  const mutateFn = (request: ShareDocumentRequest) => service.post(request);

  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['shareDocument'],
    mutationFn: mutateFn,
    onSuccess: () => {
      const keys = [['collaborators', documentId]];
      keys.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
    },
  });
};

export default useShareDocument;
