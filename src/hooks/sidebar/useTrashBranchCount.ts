import type { Count } from '@/models/Count';
import APIService from '@/services/apiService';
import { useQuery } from '@tanstack/react-query';

const useTrashBranchCount = () => {
  const service = new APIService<Count>('/documents/trash/branches/count');
  const data = () => service.get();

  return useQuery({
    queryKey: ['trashBranchCount'],
    queryFn: data,
  });
};

export default useTrashBranchCount;
