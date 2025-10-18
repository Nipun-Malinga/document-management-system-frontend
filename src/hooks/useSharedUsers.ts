import { useQuery } from '@tanstack/react-query';
import APIService from '../services/apiService';
import ms from 'ms';
import type { SharedUsers } from '../models/SharedUser';

export const useSharedUsers = (documentId: string) => {
  const service = new APIService<SharedUsers>(
    `/documents/${documentId}/share/users`
  );

  const data = () => service.get();

  return useQuery({
    queryKey: ['sharedUsers', documentId],
    queryFn: data,
    staleTime: ms('1 Minutes'),
    refetchInterval: ms('10 Minutes'),
  });
};
