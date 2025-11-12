import type { TrashDocumentResponse } from '@/models/Trash';
import APIService from '@/services/apiService';
import { useQuery } from '@tanstack/react-query';
import ms from 'ms';

const useTrashedDocuments = () => {
  const service = new APIService<TrashDocumentResponse>('/documents/trash');

  const data = () => service.get();

  return useQuery({
    queryKey: ['trashed_documents_own'],
    queryFn: data,
    staleTime: ms('1 Minutes'),
    refetchInterval: ms('10 Minutes'),
  });
};

export default useTrashedDocuments;
