import { useSessionStore } from "@/features/auth/stores/sessionStore";

const useUser = () => useSessionStore((state) => state.user);
export default useUser;
