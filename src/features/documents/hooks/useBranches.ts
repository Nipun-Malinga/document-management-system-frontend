import type { Branch } from "@/features/documents/types/Branch";
import type { BranchParams } from "@/features/documents/types/CollectionParams";
import useCollectionQuery from "@/shared/hooks/useCollectionQuery";

const useBranches = (documentId: string, params: BranchParams = {}) =>
	useCollectionQuery<Branch, BranchParams>(
		`/documents/${documentId}/branches`,
		["branches", documentId],
		params,
		{ enabled: Boolean(documentId), staleTime: 300000 },
	);

export default useBranches;
