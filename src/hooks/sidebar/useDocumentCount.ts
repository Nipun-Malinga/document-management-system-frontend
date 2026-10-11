import { useQuery } from "@tanstack/react-query";
import type { Count } from "@/models/Count";
import APIService from "@/services/apiService";

const useDocumentCount = () => {
	const service = new APIService<Count>("/documents/count");
	const data = () => service.get();

	return useQuery({
		queryKey: ["documentCount"],
		queryFn: data,
	});
};

export default useDocumentCount;
