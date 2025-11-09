import type { Permission } from '@/models/Permission';
import APIService from '@/services/apiService';
import { useQuery } from '@tanstack/react-query';
import ms from 'ms';

export const useValidatePermissions = (documentId: string, branchId: string) => {
  const service = new APIService<Permission>(`/permissions/documents/${documentId}/branches/${branchId}`);

  const data = () => service.get();

  return useQuery({
    queryKey: ['permissions', documentId, branchId],
    queryFn: data,
    staleTime: ms('10 Minutes'),
  });
};
