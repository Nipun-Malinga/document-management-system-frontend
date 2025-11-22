import type { BranchRequest } from '@/models/Branch';
import APIService from '@/services/apiService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useCreateBranch = (documentId: string, branchId: string) => {
  const service = new APIService<BranchRequest>(
    `/documents/${documentId}/branches/${branchId}`
  );
  const mutateFn = (data: BranchRequest) => service.post(data);

  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['create-branch', documentId, branchId],
    mutationFn: mutateFn,
    onSuccess: () => {
      const keys = [['branches', documentId]];
      keys.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
    },
  });
};

export default useCreateBranch;
