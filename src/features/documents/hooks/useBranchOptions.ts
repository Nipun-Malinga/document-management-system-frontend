import { useQuery } from "@tanstack/react-query";
import type { Branch, BranchResponse } from "@/features/documents/types/Branch";
import APIService from "@/services/apiService";
import {
	normalizePageParams,
	parsePageResponse,
} from "@/shared/utils/collectionUtils";

// The compact selector exposes the full collection without paging controls.
const useBranchOptions = (documentId: string) => {
	const service = new APIService<BranchResponse>(
		`/documents/${documentId}/branches`,
	);
	return useQuery({
		queryKey: ["branches", documentId, "dropdown"],
		enabled: Boolean(documentId),
		staleTime: 300000,
		retry: false,
		queryFn: async ({ signal }) => {
			const branches = new Map<string, Branch>();
			for (let page = 0; ; page++) {
				const response = parsePageResponse(
					await service.get({
						params: normalizePageParams({ page, size: 50 }),
						signal,
					}),
				);
				if (
					response.page !== page ||
					(response.hasNext &&
						(!response.content.length || page + 1 >= response.totalPages))
				) {
					throw new Error("The server returned an invalid branch collection.");
				}
				for (const branch of response.content) branches.set(branch.id, branch);
				if (!response.hasNext) return [...branches.values()];
			}
		},
	});
};
export default useBranchOptions;
