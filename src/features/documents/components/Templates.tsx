import { useRef, useState } from 'react';
import axios from 'axios';
import type { ProblemDetail } from '@/models/ProblemDetail';
import type { TemplateParams } from '@/models/PageResponse';
import useCollectionParams from '@/hooks/useCollectionParams';
import CollectionResults from './collections/CollectionResults';
import CollectionPagination from './collections/CollectionPagination';
import CollectionFilters from './collections/CollectionFilters';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ContentRenderer } from '@/features/editor';
import { convertToTiptapContent } from '@/features/editor/utils';
import { useCreateDocument } from '@/hooks/document';
import { useGetTemplates } from '@/hooks/templates';
import useEditorTemplate from '@/states/useEditorTemplate';
import type { Content } from '@tiptap/core';
import { useNavigate } from 'react-router-dom';

const Templates = () => {
  const { params, update, setPage } = useCollectionParams<TemplateParams>();
  const query = useGetTemplates(params);
  const [creationError, setCreationError] = useState('');
  const creating = useRef(false);
  const { mutateAsync, isPending } = useCreateDocument();
  const { setTemplate } = useEditorTemplate();
  const navigate = useNavigate();

  const createDocument = async (templateId: number, name: string, content: Content) => {
    if (creating.current) return;
    creating.current = true;
    setCreationError('');
    try {
      const doc = await mutateAsync({ title: name, status: 'PUBLIC', templateId });
      setTemplate({ id: templateId, title: name, template: content });
      navigate(`/document/${doc.id}/branch/${doc.mainBranchId}/edit`);
    } catch (error) {
      const detail = axios.isAxiosError<ProblemDetail>(error) ? error.response?.data?.detail : undefined;
      setCreationError(typeof detail === 'string' && detail.trim() ? detail : 'Could not create the document. Choose a template to try again.');
    } finally {
      creating.current = false;
    }
  };

  return (
    <>
      <CollectionFilters params={params} update={update} fields={[{ name: 'title', label: 'Exact template title', maxLength: 30 }]} sorts={[['id,asc', 'Default order'], ['title,asc', 'Title A–Z']]} label='templates' />
      {creationError && <p role='alert' className='my-3 text-sm text-destructive'>{creationError}</p>}
      {isPending && <p role='status' className='my-3 text-sm text-muted-foreground'>Creating document…</p>}
      <CollectionResults query={query} label='templates'>
        {(templates) => (
          <div className='relative px-12 sm:px-20'>
            <Carousel
              key={JSON.stringify(params)}
              opts={{
                align: 'start',
              }}
              className='w-full'
            >
              <CarouselContent className='-ml-4 py-2'>
                {templates.map((template) => (
                  <CarouselItem
                    key={template.id}
                    className='pl-4 select-none basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/6'
                  >
                    <div className='group relative'>
                      <div className='relative h-72 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 overflow-hidden'>
                        {/* Template preview */}
                        <div inert aria-hidden='true' className='absolute inset-0 flex flex-col p-0.5 overflow-hidden'>
                          <div className=' text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 pb-4 overflow-hidden'>
                            <ContentRenderer
                              type='secondary'
                              content={convertToTiptapContent(template.template)}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Template name */}
                      <div className='mt-3 px-2'>
                        <h3 className='font-semibold text-sm text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 truncate'>
                          {template.title}
                        </h3>
                      </div>
                      <button
                        type='button'
                        aria-label={`Create document from ${template.title}`}
                        disabled={isPending}
                        onClick={() => { void createDocument(template.id, template.title, convertToTiptapContent(template.template)); }}
                        className='absolute inset-0 w-full cursor-pointer rounded-xl disabled:cursor-wait focus-visible:outline-2 focus-visible:outline-ring'
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <CarouselPrevious className='-translate-x-1/2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-110 transition-all duration-200' />
              <CarouselNext className='translate-x-1/2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-110 transition-all duration-200' />
            </Carousel>
          </div>
        )}
      </CollectionResults>
      <CollectionPagination data={query.data} pending={query.isFetching} onPage={setPage} label='templates' />
    </>
  );
};

export default Templates;
