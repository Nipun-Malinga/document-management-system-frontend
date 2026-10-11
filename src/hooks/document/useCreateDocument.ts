import { refreshDocumentMutation } from './documentMutationCache';
import { assertSession, getSession } from '@/states/sessionStore';
import type { Document, DocumentRequest } from '@/models/Document';
import APIService from '@/services/apiService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useCreateDocument = () => {
  const epoch = getSession().epoch;
  const queryClient = useQueryClient();
  const service = new APIService<DocumentRequest, Document>('/documents');

  return useMutation({
    retry: false,
    mutationKey: ['create-document'],
    mutationFn: (data: DocumentRequest) => service.post(data),
    onSuccess: async (response) => {
      assertSession(epoch);
      queryClient.setQueryData(['document', response.id], response);
      await refreshDocumentMutation(queryClient, 'create', response.id, epoch);
    },
  });
};

export default useCreateDocument;
