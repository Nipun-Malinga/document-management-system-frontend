import type { Count } from '@/models/Count';
import APIService from '@/services/apiService';
import { useQuery } from '@tanstack/react-query';

const useTrashDocumentCount = () => {
  const service = new APIService<Count>('/documents/trash/count');
  const data = () => service.get();

  return useQuery({
    queryKey: ['trashDocumentCount'],
    queryFn: data,
  });
};

export default useTrashDocumentCount;
