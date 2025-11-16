import type { Document, DocumentRequest } from '@/models/Document';
import APIService from '@/services/apiService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useCreateDocument = () => {
  const queryClient = useQueryClient();
  const service = new APIService<DocumentRequest, Document>('/documents');

  return useMutation({
    mutationKey: ['create-document'],
    mutationFn: (data: DocumentRequest) => service.post(data),
    onSuccess: () => {
      const keys = [['documents-own']];
      keys.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
    },
  });
};

export default useCreateDocument;
