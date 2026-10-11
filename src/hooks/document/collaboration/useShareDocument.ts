import { assertSession, getSession } from '@/states/sessionStore';
import type { ShareDocumentRequest } from '@/models/SharedDocument';
import type { Document } from '@/models/Document';
import APIService from '@/services/apiService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usePersistenceRegistry } from '@/features/editor/persistence/persistenceRegistry';

const useShareDocument = (documentId: string) => {
  const epoch = getSession().epoch;
  const service = new APIService<ShareDocumentRequest>(`/documents/${documentId}/share`);
  const metadata = new APIService<Document>(`/documents/${documentId}`);
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['shareDocument', documentId],
    retry: false,
    mutationFn: async (request: ShareDocumentRequest) => {
      const document = await metadata.get();
      const active = usePersistenceRegistry.getState().active;
      if (!document.shared || active?.documentId === documentId && active.mode === 'solo') {
        // Never switch a mounted REST editor to an unverified CRDT room.
        if (active?.documentId === documentId) await active.coordinator?.prepareToLeave();
        throw new Error('First sharing is paused until collaborative room initialization from saved content is verified.');
      }
      return service.post(request);
    },
    onSuccess: async () => {
      assertSession(epoch);
      await Promise.all([
        ['document', documentId], ['collaborators', documentId], ['permissions', documentId],
        ['documents-own'], ['shared-with'], ['documentCount'], ['sharedWithCount'],
      ].map((queryKey) => queryClient.invalidateQueries({ queryKey })));
    },
  });
};
export default useShareDocument;
