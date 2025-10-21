import { useQuery } from '@tanstack/react-query';
import ms from 'ms';
import type { ContentResponse } from '../models/Content';
import APIService from '../services/apiService';

export const useContent = (documentId: string, branchName: string) => {
  const service = new APIService<ContentResponse>(
    `/documents/${documentId}/branches/${branchName}/content`
  );
  const data = () => service.get();

  return useQuery({
    queryKey: ['branches', documentId, 'branch', branchName],
    queryFn: data,
    staleTime: ms('5 Minutes'),
  });
};
