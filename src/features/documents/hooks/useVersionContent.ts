import { useQuery } from "@tanstack/react-query";
import type { ContentResponse } from "@/features/documents/types/Content";
import { parseEditorContent } from "@/features/editor/persistence/contentUtils";
import APIService from "@/services/apiService";

const useVersionContent = (documentId: string, versionId: string) => {
	const service = new APIService<ContentResponse>(
		`/documents/${documentId}/versions/${versionId}`,
	);
	return useQuery({
		queryKey: ["version-content", documentId, versionId],
		queryFn: async ({ signal }) => {
			const result = await service.get({ signal });
			parseEditorContent(result.content);
			return result;
		},
		enabled: Boolean(documentId && versionId),
		retry: false,
	});
};
export default useVersionContent;
