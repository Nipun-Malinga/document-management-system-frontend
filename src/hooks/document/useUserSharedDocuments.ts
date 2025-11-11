
import type { SharedDocumentsResponse } from '@/models/SharedDocument';
import APIService from '@/services/apiService';
import { useQuery } from '@tanstack/react-query';
import ms from 'ms';

const useUserSharedDocuments = () => {
  const service = new APIService<SharedDocumentsResponse>('/documents/share');
  const data = () => service.get();

  return useQuery({
    queryKey: ['shared-with'],
    queryFn: data,
    staleTime: ms('1 Minutes'),
    refetchInterval: ms('10 Minutes'),
  });
};

export default useUserSharedDocuments;
