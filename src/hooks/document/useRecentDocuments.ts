import type { DocumentParams } from "@/models/PageResponse";
import useUserDocuments from "./useUserDocuments";

export const recentDocumentParams = { sort: "updatedAt,desc" } as const;
const useRecentDocuments = (params: DocumentParams = {}) =>
	useUserDocuments({ ...params, ...recentDocumentParams });
export default useRecentDocuments;
