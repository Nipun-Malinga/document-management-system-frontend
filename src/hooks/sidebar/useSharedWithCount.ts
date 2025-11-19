import type { Count } from '@/models/Count';
import APIService from '@/services/apiService';
import { useQuery } from '@tanstack/react-query';

const useSharedWithCount = () => {
  const service = new APIService<Count>('/documents/shared/count/user');
  const data = () => service.get();

  return useQuery({
    queryKey: ['sharedWithCount'],
    queryFn: data,
  });
};

export default useSharedWithCount;
