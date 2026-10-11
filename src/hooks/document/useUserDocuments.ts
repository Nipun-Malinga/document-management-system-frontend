import useCollectionQuery from "@/hooks/useCollectionQuery";
import type { Document } from "@/models/Document";
import type { DocumentParams } from "@/models/PageResponse";

const useUserDocuments = (params: DocumentParams = {}) =>
	useCollectionQuery<Document, DocumentParams>(
		`/documents`,
		["documents-own"],
		params,
		{ staleTime: 60000, refetchInterval: 600000 },
	);

export default useUserDocuments;
