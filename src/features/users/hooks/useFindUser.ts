import { useQuery } from "@tanstack/react-query";
import { userSchema } from "@/features/users/schemas/User";
import type { User } from "@/features/users/types/User";
import APIService from "@/services/apiService";

const useFindUser = (email: string) => {
	const valid = userSchema.safeParse({ email });
	const submittedEmail = valid.success ? valid.data.email : "";
	const service = new APIService<User>(
		`/users/find/${encodeURIComponent(submittedEmail)}`,
	);
	const mutateFn = ({ signal }: { signal: AbortSignal }) =>
		service.get({ signal });

	return useQuery({
		queryKey: ["user-lookup", submittedEmail],
		queryFn: mutateFn,
		enabled: Boolean(submittedEmail),
		retry: false,
	});
};

export default useFindUser;
