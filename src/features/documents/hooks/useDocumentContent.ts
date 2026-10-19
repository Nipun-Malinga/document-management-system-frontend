import { useQuery } from "@tanstack/react-query";
import ms from "ms";
import type { ContentResponse } from "@/features/documents/types/Content";
import { parseEditorContent } from "@/features/editor/persistence/contentUtils";
import APIService from "@/services/apiService";

const useDocumentContent = (documentId: string, branchId: string) => {
	const service = new APIService<ContentResponse>(
		`/documents/${documentId}/branches/${branchId}/content`,
	);
	const data = async ({ signal }: { signal: AbortSignal }) => {
		const result = await service.get({ signal });
		parseEditorContent(result.content);
		return result;
	};

	return useQuery({
		queryKey: ["branch-content", documentId, branchId],
		queryFn: data,
		enabled: Boolean(documentId && branchId),
		retry: false,
		staleTime: ms("5 Minutes"),
	});
};

export default useDocumentContent;
