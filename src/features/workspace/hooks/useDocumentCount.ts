import { useQuery } from "@tanstack/react-query";
import APIService from "@/services/apiService";
import type { Count } from "@/shared/types/Count";

const useDocumentCount = () => {
	const service = new APIService<Count>("/documents/count");
	const data = () => service.get();

	return useQuery({
		queryKey: ["documentCount"],
		queryFn: data,
	});
};

export default useDocumentCount;
