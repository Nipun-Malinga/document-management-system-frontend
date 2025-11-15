import type { Count } from '@/models/Count';
import APIService from '@/services/apiService';
import { useQuery } from '@tanstack/react-query';

const useFavoriteCount = () => {
  const service = new APIService<Count>('/documents/favorites/count');
  const data = () => service.get();

  return useQuery({
    queryKey: ['document-favorites-count'],
    queryFn: data,
  });
};

export default useFavoriteCount;
