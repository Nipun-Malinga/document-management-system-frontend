import APIService from '@/services/apiService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { replaceSoloBranch } from '@/features/editor/persistence/documentWorkflows';

const useMergeVersion = (documentId: string, targetBranchId: string, versionId: string) => {
  const client = useQueryClient();
  const service = new APIService(`/documents/${documentId}/branches/${targetBranchId}/merge/versions/${versionId}`);
  return useMutation({
    mutationKey: ['merge-version', documentId, targetBranchId, versionId],
    retry: false,
    mutationFn: async () => {
      if (!targetBranchId || !versionId) throw new Error('Choose a target branch and source version.');
      await replaceSoloBranch(documentId, targetBranchId, () => service.post(), client);
    },
  });
};
export default useMergeVersion;
