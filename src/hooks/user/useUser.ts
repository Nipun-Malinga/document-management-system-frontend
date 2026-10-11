import { useSessionStore } from '@/states/sessionStore';

const useUser = () => useSessionStore((state) => state.user);
export default useUser;
