import APIService from '@/services/apiService';
import { useMutation } from '@tanstack/react-query';

type SignInRequest = {
  email: string;
  password: string;
};

type SignInResponse = {
  token: string;
};

const useSignIn = () => {
  const service = new APIService<SignInRequest, SignInResponse>('/auth/login');
  const mutateFn = (data: SignInRequest) => service.post(data);

  return useMutation({
    mutationKey: ['signin'],
    mutationFn: mutateFn,
    onSuccess: (response) => {
      localStorage.setItem('jwt-access-token', response.token);
    },
  });
};

export default useSignIn;
