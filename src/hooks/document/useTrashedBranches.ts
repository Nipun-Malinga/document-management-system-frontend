import type { TrashBranchResponse } from '@/models/Trash';
import APIService from '@/services/apiService';
import { useQuery } from '@tanstack/react-query';
import ms from 'ms';

const useTrashBranches = () => {
  const service = new APIService<TrashBranchResponse>('/documents/trash/branches');
  const data = () => service.get();

  return useQuery({
    queryKey: ['trashed_branches_own'],
    queryFn: data,
    staleTime: ms('1 Minutes'),
    refetchInterval: ms('10 Minutes'),
  });
};

export default useTrashBranches;
