import { useQuery } from "@tanstack/react-query";
import APIService from "@/services/apiService";
import type { Count } from "@/shared/types/Count";

const useFavoriteCount = () => {
	const service = new APIService<Count>("/documents/favorites/count");
	const data = () => service.get();

	return useQuery({
		queryKey: ["document-favorites-count"],
		queryFn: data,
	});
};

export default useFavoriteCount;
