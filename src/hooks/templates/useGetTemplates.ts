import type { TemplateResponse } from '@/models/Template';
import type { TemplateParams } from '@/models/PageResponse';
import useCollectionQuery from '@/hooks/useCollectionQuery';

const useGetTemplates = (params: TemplateParams = {}) =>
  useCollectionQuery<TemplateResponse, TemplateParams>(`/documents/templates`, ['templates'], params, {  });

export default useGetTemplates;
