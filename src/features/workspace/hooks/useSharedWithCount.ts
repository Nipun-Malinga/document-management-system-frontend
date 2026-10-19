import { useQuery } from "@tanstack/react-query";
import APIService from "@/services/apiService";
import type { Count } from "@/shared/types/Count";

const useSharedWithCount = () => {
	const service = new APIService<Count>("/documents/shared/count/user");
	const data = () => service.get();

	return useQuery({
		queryKey: ["sharedWithCount"],
		queryFn: data,
	});
};

export default useSharedWithCount;
