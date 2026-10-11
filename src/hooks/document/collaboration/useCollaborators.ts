import type { Collaborator } from '@/models/Collaborator';
import type { CollaboratorParams } from '@/models/PageResponse';
import useCollectionQuery from '@/hooks/useCollectionQuery';

const useCollaborators = (documentId: string, params: CollaboratorParams = {}) =>
  useCollectionQuery<Collaborator, CollaboratorParams>(`/documents/${documentId}/share/users`, ['collaborators', documentId], params, { enabled: Boolean(documentId), staleTime: 60000 });

export default useCollaborators;
