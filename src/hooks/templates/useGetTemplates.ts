import type {  TemplateResponse } from '@/models/Template';
import APIService from '@/services/apiService';
import { useQuery } from '@tanstack/react-query';

const useGetTemplates = () => {
  const service = new APIService<TemplateResponse[]>('/documents/templates');
  const data = () => service.get();

  return useQuery({
    queryKey: ['templates'],
    queryFn: data,
  });
};

export default useGetTemplates;
