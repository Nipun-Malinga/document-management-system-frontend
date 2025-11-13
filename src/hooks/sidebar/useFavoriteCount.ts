import type { Count } from '@/models/Count';
import APIService from '@/services/apiService';
import { useQuery } from '@tanstack/react-query';

const useFavoriteCount = () => {
  const service = new APIService<Count>('');
  const data = () => service.get();

  return useQuery({
    queryKey: ['useFavoriteCount'],
    queryFn: data,
  });
};

export default useFavoriteCount;
