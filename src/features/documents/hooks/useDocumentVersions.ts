import type { VersionParams } from "@/features/documents/types/CollectionParams";
import type { Version } from "@/features/documents/types/Version";
import useCollectionQuery from "@/shared/hooks/useCollectionQuery";

const useDocumentVersions = (documentId: string, params: VersionParams = {}) =>
	useCollectionQuery<Version, VersionParams>(
		`/documents/${documentId}/versions`,
		["versions", documentId],
		params,
		{ enabled: Boolean(documentId) },
	);

export default useDocumentVersions;
