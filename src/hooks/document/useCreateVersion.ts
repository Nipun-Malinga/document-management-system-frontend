import { assertSession, getSession } from '@/states/sessionStore';
import { createSoloSnapshot } from '@/features/editor/persistence/documentWorkflows';
import type { VersionRequest } from '@/models/Version';
import APIService from '@/services/apiService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useCreateVersion = (documentId: string, branchId: string) => {
  const epoch = getSession().epoch;
  const service = new APIService<VersionRequest>(
    `/documents/${documentId}/branches/${branchId}/versions`
  );
  const mutationFn = (data: VersionRequest) => createSoloSnapshot(documentId, branchId, () => service.post(data));

  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['create-version'],
    mutationFn: mutationFn,
    retry: false,
    onSuccess: async () => {
      assertSession(epoch);
      const keys = [['versions', documentId]];
      await Promise.all(keys.map((key) => queryClient.invalidateQueries({ queryKey: key })));
    },
  });
};

export default useCreateVersion;
