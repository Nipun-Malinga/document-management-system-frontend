import { useQuery } from "@tanstack/react-query";
import APIService from "@/services/apiService";
import type { Count } from "@/shared/types/Count";

const useTrashBranchCount = () => {
	const service = new APIService<Count>("/documents/trash/branches/count");
	const data = () => service.get();

	return useQuery({
		queryKey: ["trashBranchCount"],
		queryFn: data,
	});
};

export default useTrashBranchCount;
