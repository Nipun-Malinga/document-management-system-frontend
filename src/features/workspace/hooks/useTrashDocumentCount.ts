import { useQuery } from "@tanstack/react-query";
import APIService from "@/services/apiService";
import type { Count } from "@/shared/types/Count";

const useTrashDocumentCount = () => {
	const service = new APIService<Count>("/documents/trash/count");
	const data = () => service.get();

	return useQuery({
		queryKey: ["trashDocumentCount"],
		queryFn: data,
	});
};

export default useTrashDocumentCount;
