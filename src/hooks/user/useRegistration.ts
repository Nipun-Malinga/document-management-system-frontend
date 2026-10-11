import APIService from '@/services/apiService';
import type { RegisterRequest, RegisterResponse } from '@/types/Register';
import { useMutation } from '@tanstack/react-query';

const useRegistration = () => {
  const service = new APIService<RegisterRequest, RegisterResponse>(
    '/users/register'
  );
  const mutateFn = (data: RegisterRequest) => service.post(data);

  return useMutation({
    retry: false,
    mutationKey: ['registration'],
    mutationFn: mutateFn,
  });
};

export default useRegistration;
