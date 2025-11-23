import type { VersionRequest } from '@/models/Version';
import APIService from '@/services/apiService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useCreateVersion = (documentId: string, branchId: string) => {
  const service = new APIService<VersionRequest>(
    `/documents/${documentId}/branches/${branchId}/versions`
  );
  const mutationFn = (data: VersionRequest) => service.post(data);

  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['create-version'],
    mutationFn: mutationFn,
    onSuccess: () => {
      const keys = [['versions', documentId]];
      keys.map((key) => queryClient.invalidateQueries({ queryKey: key }));
    },
  });
};

export default useCreateVersion;
