import APIService from '@/services/apiService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useRestoreBranch = (documentId: string, branchId: string) => {
  const queryClient = useQueryClient();
  const service = new APIService(
    `/documents/trash/restore/${documentId}/branches/${branchId}`
  );

  return useMutation({
    mutationKey: ['trashed_branches_own'],
    mutationFn: () => service.post(),
    onSuccess: () => {
      const keys = [['documents-own'], ['trashed_branches_own']];
      keys.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
    },
    onError: () => {
      console.error('Failed to restore branch');
    },
  });
};

export default useRestoreBranch;
