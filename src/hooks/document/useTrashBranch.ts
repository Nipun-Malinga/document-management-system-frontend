import APIService from '@/services/apiService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useTrashBranch = (documentId: string, branchId: string) => {
  const service = new APIService(
    `/documents/trash/${documentId}/branches/${branchId}`
  );
  const mutateFn = () => service.delete();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['trashBranch', branchId],
    mutationFn: mutateFn,
    onSuccess: () => {
      const keys = [
        ['branches', documentId],
        ['trashed_branches_own'],
        ['trashBranchCount'],
      ];
      keys.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
    },
  });
};

export default useTrashBranch;
