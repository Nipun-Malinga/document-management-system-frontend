import type { DocumentsResponse } from '@/models/Document';
import APIService from '@/services/apiService';
import { useQuery } from '@tanstack/react-query';
import ms from 'ms';

const useUserDocuments = () => {
  const service = new APIService<DocumentsResponse>('/documents');
  const data = () => service.get();

  return useQuery({
    queryKey: ['documents-own'],
    queryFn: data,
    staleTime: ms('1 Minutes'),
    refetchInterval: ms('10 Minutes'),
  });
};

export default useUserDocuments;
