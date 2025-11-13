import APIService from '@/services/apiService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useDeleteBranch = (documentId: string, branchId: string) => {
  const queryClient = useQueryClient();
  const service = new APIService(
    `/documents/trash/delete/${documentId}/branches/${branchId}`
  );

  return useMutation({
    mutationKey: ['trashed_branches_own'],
    mutationFn: () => service.delete(),
    onSuccess: () => {
      const keys = [
        ['documents-own'],
        ['trashed_branches_own'],
        ['trashBranchCount'],
      ];
      keys.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
    },
    onError: () => {
      console.error('Failed to delete branch');
    },
  });
};

export default useDeleteBranch;
