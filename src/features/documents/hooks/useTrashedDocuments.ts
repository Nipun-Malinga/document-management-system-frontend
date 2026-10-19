import type { DocumentParams } from "@/features/documents/types/CollectionParams";
import type { TrashDocument } from "@/features/documents/types/Trash";
import useCollectionQuery from "@/shared/hooks/useCollectionQuery";

const useTrashedDocuments = (params: Omit<DocumentParams, "favorite"> = {}) =>
	useCollectionQuery<TrashDocument, Omit<DocumentParams, "favorite">>(
		`/documents/trash`,
		["trashed_documents_own"],
		params,
		{ staleTime: 60000, refetchInterval: 600000 },
	);

export default useTrashedDocuments;
