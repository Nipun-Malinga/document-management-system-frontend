import { refreshDocumentMutation } from '@/hooks/document/documentMutationCache';
import { getSession } from '@/states/sessionStore';
import type { QueryClient } from '@tanstack/react-query';
import type { ContentResponse } from '@/models/Content';
import APIService from '@/services/apiService';
import { requireSoloCoordinator } from './persistenceRegistry';
import { parseEditorContent } from './contentUtils';

export const createSoloSnapshot = async <T,>(documentId: string, branchId: string, create: () => Promise<T>) => {
  const coordinator = requireSoloCoordinator(documentId, branchId);
  return coordinator.exclusive(async () => {
    await coordinator.flush();
    coordinator.assertWritable();
    return create();
  });
};

export const replaceSoloBranch = async (
  documentId: string, branchId: string, mutate: () => Promise<unknown>, client: QueryClient,
) => {
  const coordinator = requireSoloCoordinator(documentId, branchId);
  const epoch = getSession().epoch;
  const service = new APIService<ContentResponse>(`/documents/${documentId}/branches/${branchId}/content`);
  await coordinator.replace(mutate, async () => {
    const key = ['branch-content', documentId, branchId];
    await client.cancelQueries({ queryKey: key, exact: true });
    const result = await service.get();
    coordinator.assertWritable();
    parseEditorContent(result.content);
    client.setQueryData(key, result);
    // Keep the retry-reload path fresh too, without repeating the merge POST.
    await refreshDocumentMutation(client, 'merge', documentId, epoch);
    return result.content;
  });
};
