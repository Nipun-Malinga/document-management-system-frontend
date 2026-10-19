import type { SharedDocumentParams } from "@/features/documents/types/CollectionParams";
import type { SharedDocument } from "@/features/documents/types/SharedDocument";
import useCollectionQuery from "@/shared/hooks/useCollectionQuery";

const useUserSharedDocuments = (params: SharedDocumentParams = {}) =>
	useCollectionQuery<SharedDocument, SharedDocumentParams>(
		`/documents/share`,
		["shared-with"],
		params,
		{ staleTime: 60000, refetchInterval: 600000 },
	);

export default useUserSharedDocuments;
