import type { Document, UpdateDocumentRequest } from '@/models/Document';
import APIService from '@/services/apiService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useUpdateDocumentInfo = (documentId: string) => {
  const service = new APIService<UpdateDocumentRequest, Document>(
    `/documents/${documentId}`
  );
  const mutateFn = (data: UpdateDocumentRequest) => service.put(data);

  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['documentInfo', documentId],
    mutationFn: mutateFn,
    onSuccess: () => {
      const keys = [['documents-own']];
      keys.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
    },
  });
};

export default useUpdateDocumentInfo;
