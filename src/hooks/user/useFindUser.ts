import { useQuery } from "@tanstack/react-query";
import type { User } from "@/models/User";
import APIService from "@/services/apiService";
import { userSchema } from "@/types/User";

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
