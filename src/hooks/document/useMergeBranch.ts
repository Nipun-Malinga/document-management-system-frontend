import APIService from '@/services/apiService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { replaceSoloBranch } from '@/features/editor/persistence/documentWorkflows';

const useMergeBranch = (documentId: string, targetBranchId: string, sourceBranchId: string) => {
  const client = useQueryClient();
  const service = new APIService(`/documents/${documentId}/branches/${targetBranchId}/merge/${sourceBranchId}`);
  return useMutation({
    mutationKey: ['merge-branch', documentId, targetBranchId, sourceBranchId],
    retry: false,
    mutationFn: async () => {
      if (!targetBranchId || !sourceBranchId || targetBranchId === sourceBranchId) throw new Error('Choose a different source branch.');
      await replaceSoloBranch(documentId, targetBranchId, () => service.post(), client);
    },
  });
};
export default useMergeBranch;
