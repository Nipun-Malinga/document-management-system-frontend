import { useQuery } from '@tanstack/react-query';
import ms from 'ms';
import type { Document } from '../models/Document';
import APIService from '../services/apiService';

export const useDocument = (documentId: string) => {
  const service = new APIService<Document>(`/documents/${documentId}`);
  const data = () => service.get();

  return useQuery({
    queryKey: ['document', documentId],
    queryFn: data,
    staleTime: ms('1 Minutes'),
  });
};
