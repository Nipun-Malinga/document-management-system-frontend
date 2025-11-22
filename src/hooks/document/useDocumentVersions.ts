import type { VersionResponse } from '@/models/Version';
import APIService from '@/services/apiService';
import { useQuery } from '@tanstack/react-query';

const useDocumentVersions = (documentId: string) => {
  const service = new APIService<VersionResponse>(
    `/documents/${documentId}/versions`
  );
  const dataFn = () => service.get();

  return useQuery({
    queryKey: ['versions', documentId],
    queryFn: dataFn,
  });
};

export default useDocumentVersions;
