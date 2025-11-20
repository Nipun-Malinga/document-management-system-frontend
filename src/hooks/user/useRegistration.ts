import APIService from '@/services/apiService';
import type { TRegisterSchema } from '@/types/Register';
import { useMutation } from '@tanstack/react-query';

interface RegistrationRequest {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

interface RegistrationResponse {}

const useRegistration = () => {
  const service = new APIService<RegistrationRequest, RegistrationResponse>(
    '/users/register'
  );
  const mutateFn = (
    data: Omit<TRegisterSchema, 'confirmPassword' | 'acceptTerms'>
  ) => service.post(data);

  return useMutation({
    mutationKey: ['registration'],
    mutationFn: mutateFn,
  });
};

export default useRegistration;
