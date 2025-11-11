import type { CollaboratorsResponse } from '@/models/Collaborator';
import APIService from '@/services/apiService';
import { useQuery } from '@tanstack/react-query';
import ms from 'ms';

export const useSharedUsers = (documentId: string) => {
  const service = new APIService<CollaboratorsResponse>(
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

export default useSharedUsers;
