import APIService from '@/services/apiService';
import { useMutation } from '@tanstack/react-query';

const useMergeBranch = (
  documentId: string,
  branchId: string,
  mergeBranchId: string,
) => {
  const service = new APIService(
    `/documents/${documentId}/branches/${branchId}/merge/${mergeBranchId}`,
    );

  const data = () => service.post();

  return useMutation({
    mutationKey: ['branches', documentId, 'branch', mergeBranchId],
    mutationFn: data,
  });
};

export default useMergeBranch;
