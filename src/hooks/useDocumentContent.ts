import { useQuery } from '@tanstack/react-query';
import ms from 'ms';
import type { ContentResponse } from '../models/Content';
import APIService from '../services/apiService';

export const useDocumentContent = (documentId: string, branchId: string) => {
  const service = new APIService<ContentResponse>(
    `/documents/${documentId}/branches/${branchId}/content`
  );
  const data = () => service.get();

  return useQuery({
    queryKey: ['branches', documentId, 'branch', branchId],
    queryFn: data,
    staleTime: ms('5 Minutes'),
  });
};
