import { login } from '@/services/sessionService';
import { useMutation } from '@tanstack/react-query';

const useSignIn = () => useMutation({ retry: false, mutationKey: ['signin'], mutationFn: login });
export default useSignIn;
