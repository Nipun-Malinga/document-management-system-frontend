import { login } from '@/services/sessionService';
import { useMutation } from '@tanstack/react-query';

const useSignIn = () => useMutation({ mutationKey: ['signin'], mutationFn: login });
export default useSignIn;
