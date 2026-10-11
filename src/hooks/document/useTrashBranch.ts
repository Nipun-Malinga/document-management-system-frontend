import { refreshDocumentMutation } from './documentMutationCache';
import { getSession } from '@/states/sessionStore';
import APIService from '@/services/apiService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useTrashBranch = (documentId: string, branchId: string) => {
  const epoch = getSession().epoch;
  const service = new APIService(
    `/documents/trash/${documentId}/branches/${branchId}`
  );
  const mutateFn = () => service.delete();
  const queryClient = useQueryClient();

  return useMutation({
    retry: false,
    mutationKey: ['trashBranch', branchId],
    mutationFn: mutateFn,
    onSuccess: async () => {
      await refreshDocumentMutation(queryClient, 'trashBranch', documentId, epoch);
    },
  });
};

export default useTrashBranch;
