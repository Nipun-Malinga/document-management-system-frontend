import { useMutation } from "@tanstack/react-query";
import { login } from "@/services/sessionService";

const useSignIn = () =>
	useMutation({ retry: false, mutationKey: ["signin"], mutationFn: login });
export default useSignIn;
