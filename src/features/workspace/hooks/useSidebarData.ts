import { useQuery } from "@tanstack/react-query";
import type { SidebarData } from "@/features/workspace/types/SidebarData";
import type { SidebarStats } from "@/features/workspace/types/SidebarStats";
import APIService from "@/services/apiService";

const useSidebarData = (): SidebarData => {
	const service = new APIService<SidebarStats>("/stats");
	const { data, isError } = useQuery({
		queryKey: ["sidebar-stats"],
		queryFn: ({ signal }) => service.get({ signal }),
	});
	const stats = isError ? undefined : data;

	return {
		documents: stats?.documents ?? null,
		quick: stats?.favorites ?? null,
		resents: stats?.recent ?? null,
		shared: stats?.shared ?? null,
		trash: stats?.trash ?? null,
	};
};

export default useSidebarData;
