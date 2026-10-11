import useCollectionQuery from "@/hooks/useCollectionQuery";
import type { SharedDocumentParams } from "@/models/PageResponse";
import type { SharedDocument } from "@/models/SharedDocument";

const useUserSharedDocuments = (params: SharedDocumentParams = {}) =>
	useCollectionQuery<SharedDocument, SharedDocumentParams>(
		`/documents/share`,
		["shared-with"],
		params,
		{ staleTime: 60000, refetchInterval: 600000 },
	);

export default useUserSharedDocuments;
