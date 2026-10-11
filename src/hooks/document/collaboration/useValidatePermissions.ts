import { useQuery } from "@tanstack/react-query";
import ms from "ms";
import type { Permission } from "@/models/Permission";
import APIService from "@/services/apiService";

const useValidatePermissions = (documentId: string, branchId: string) => {
	const service = new APIService<Permission>(
		`/permissions/documents/${documentId}/branches/${branchId}`,
	);

	const data = () => service.get();

	return useQuery({
		queryKey: ["permissions", documentId, branchId],
		queryFn: data,
		enabled: Boolean(documentId && branchId),
		staleTime: ms("10 Minutes"),
	});
};

export default useValidatePermissions;
