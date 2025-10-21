import { useQuery } from '@tanstack/react-query';
import APIService from '../services/apiService';
import ms from 'ms';
import type { BranchResponse } from '../models/Branch';

export const useBranches = (documentId: string) => {
  const service = new APIService<BranchResponse>(
    `/documents/${documentId}/branches`
  );
  const data = () => service.get();

  return useQuery({
    queryKey: ['branches', documentId],
    queryFn: data,
    staleTime: ms('5 Minutes'),
  });
};
