import APIService from '@/services/apiService';
import type { SignInRequest, SignInResponse } from '@/types/SignIn';
import { updateAccessToken } from '@/utils/authUtils';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useSignIn = () => {
  const service = new APIService<SignInRequest, SignInResponse>('/auth/login');

  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['signin'],
    mutationFn: (data: SignInRequest) => service.post(data),
    onSuccess: (response) => {
      queryClient.clear();
      updateAccessToken(response.token);
    },
  });
};

export default useSignIn;
