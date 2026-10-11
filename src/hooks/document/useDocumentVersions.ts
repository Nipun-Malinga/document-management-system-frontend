import useCollectionQuery from "@/hooks/useCollectionQuery";
import type { VersionParams } from "@/models/PageResponse";
import type { Version } from "@/models/Version";

const useDocumentVersions = (documentId: string, params: VersionParams = {}) =>
	useCollectionQuery<Version, VersionParams>(
		`/documents/${documentId}/versions`,
		["versions", documentId],
		params,
		{ enabled: Boolean(documentId) },
	);

export default useDocumentVersions;
