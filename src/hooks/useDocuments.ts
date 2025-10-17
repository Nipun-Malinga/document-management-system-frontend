import { useQuery } from '@tanstack/react-query';
import ms from 'ms';
import type { DocumentRequest } from '../models/Document';
import APIService from '../services/apiService';

export const useDocuments = () => {
  const service = new APIService<DocumentRequest>('/documents');
  var data = () => service.get();

  return useQuery({
    queryKey: ['documents-own'],
    queryFn: data,
    staleTime: ms('1 Minutes'),
    refetchInterval: ms('10 Minutes'),
  });
};
