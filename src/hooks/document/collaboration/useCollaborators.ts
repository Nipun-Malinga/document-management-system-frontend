import { useQuery } from '@tanstack/react-query';
import ms from 'ms';
import type { CollaboratorsResponse } from '../../../models/Collaborator';
import APIService from '../../../services/apiService';

const useCollaborators = (documentId: string) => {
  const service = new APIService<CollaboratorsResponse>(
    `/documents/${documentId}/share/users`
  );
  const data = () => service.get();

  return useQuery({
    queryKey: ['collaborators', documentId],
    queryFn: data,
    staleTime: ms('1 Minutes'),
  });
};

export default useCollaborators;
