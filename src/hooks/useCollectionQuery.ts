import { useQuery } from '@tanstack/react-query';
import type { PageParams, PageResponse } from '@/models/PageResponse';
import APIService from '@/services/apiService';
import { normalizePageParams, parsePageResponse } from '@/utils/collectionUtils';

const useCollectionQuery = <T, P extends PageParams>(
  endpoint: string,
  key: readonly string[],
  params: P,
  options: { enabled?: boolean; staleTime?: number; refetchInterval?: number } = {},
) => {
  const normalized = normalizePageParams(params);
  const service = new APIService<PageResponse<T>>(endpoint);
  return useQuery({
    queryKey: [...key, normalized],
    queryFn: async ({ signal }) => {
      return parsePageResponse(await service.get({ params: normalized, signal }));
    },
    retry: false,
    ...options,
  });
};

export default useCollectionQuery;
