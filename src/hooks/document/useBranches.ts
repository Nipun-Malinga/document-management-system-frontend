import type { BranchResponse } from '@/models/Branch';
import APIService from '@/services/apiService';
import { useQuery } from '@tanstack/react-query';
import ms from 'ms';

const useBranches = (documentId: string) => {
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

export default useBranches;
