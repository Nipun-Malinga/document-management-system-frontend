import type { User } from '@/models/User';
import APIService from '@/services/apiService';
import { useQuery } from '@tanstack/react-query';

const useFindUser = (email: string) => {
  const service = new APIService<User>(`/users/find/${email}`);
  const mutateFn = () => service.get();

  return useQuery({
    queryKey: ['user', email],
    queryFn: mutateFn,
  });
};

export default useFindUser;
