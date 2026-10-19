import type { DocumentParams } from "@/features/documents/types/CollectionParams";
import type { Document } from "@/features/documents/types/Document";
import useCollectionQuery from "@/shared/hooks/useCollectionQuery";

const useUserDocuments = (params: DocumentParams = {}) =>
	useCollectionQuery<Document, DocumentParams>(
		`/documents`,
		["documents-own"],
		params,
		{ staleTime: 60000, refetchInterval: 600000 },
	);

export default useUserDocuments;
