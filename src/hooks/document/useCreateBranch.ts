import { assertSession, getSession } from '@/states/sessionStore';
import { createSoloSnapshot } from '@/features/editor/persistence/documentWorkflows';
import type { BranchRequest } from '@/models/Branch';
import APIService from '@/services/apiService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useCreateBranch = (documentId: string, branchId: string) => {
  const epoch = getSession().epoch;
  const service = new APIService<BranchRequest>(
    `/documents/${documentId}/branches/${branchId}`
  );
  const mutateFn = (data: BranchRequest) => createSoloSnapshot(documentId, branchId, () => service.post(data));

  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['create-branch', documentId, branchId],
    mutationFn: mutateFn,
    retry: false,
    onSuccess: async () => {
      assertSession(epoch);
      const keys = [['branches', documentId]];
      await Promise.all(keys.map((key) => queryClient.invalidateQueries({ queryKey: key })));
    },
  });
};

export default useCreateBranch;
