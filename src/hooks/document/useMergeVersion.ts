import APIService from '@/services/apiService';
import { useMutation } from '@tanstack/react-query';

const useMergeVersion = (
  documentId: string,
  branchId: string,
  versionId: string
) => {
  const service = new APIService('');
  const mutateFn = () => service.post();

  return useMutation({
    mutationKey: ['merge', documentId, branchId, versionId],
    mutationFn: mutateFn,
  });
};

export default useMergeVersion;
