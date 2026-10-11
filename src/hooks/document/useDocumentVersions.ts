import type { Version } from '@/models/Version';
import type { VersionParams } from '@/models/PageResponse';
import useCollectionQuery from '@/hooks/useCollectionQuery';

const useDocumentVersions = (documentId: string, params: VersionParams = {}) =>
  useCollectionQuery<Version, VersionParams>(`/documents/${documentId}/versions`, ['versions', documentId], params, { enabled: Boolean(documentId) });

export default useDocumentVersions;
