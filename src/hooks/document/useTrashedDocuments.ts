import type { TrashDocument } from '@/models/Trash';
import type { DocumentParams } from '@/models/PageResponse';
import useCollectionQuery from '@/hooks/useCollectionQuery';

const useTrashedDocuments = (params: Omit<DocumentParams, 'favorite'> = {}) =>
  useCollectionQuery<TrashDocument, Omit<DocumentParams, 'favorite'>>(`/documents/trash`, ['trashed_documents_own'], params, { staleTime: 60000, refetchInterval: 600000 });

export default useTrashedDocuments;
