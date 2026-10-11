import useCollectionQuery from "@/hooks/useCollectionQuery";
import type { Branch } from "@/models/Branch";
import type { BranchParams } from "@/models/PageResponse";

const useBranches = (documentId: string, params: BranchParams = {}) =>
	useCollectionQuery<Branch, BranchParams>(
		`/documents/${documentId}/branches`,
		["branches", documentId],
		params,
		{ enabled: Boolean(documentId), staleTime: 300000 },
	);

export default useBranches;
