import { useMutation } from "@tanstack/react-query";
import type {
	RegisterRequest,
	RegisterResponse,
} from "@/features/auth/schemas/Register";
import APIService from "@/services/apiService";

const useRegistration = () => {
	const service = new APIService<RegisterRequest, RegisterResponse>(
		"/users/register",
	);
	const mutateFn = (data: RegisterRequest) => service.post(data);

	return useMutation({
		retry: false,
		mutationKey: ["registration"],
		mutationFn: mutateFn,
	});
};

export default useRegistration;
