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
  const { data: templates } = useGetTemplates();
  const { mutateAsync } = useCreateDocument();
  const { setTemplate } = useEditorTemplate();
  const navigate = useNavigate();

  const createDocument = (
    templateId: number,
    name: string,
    content: Content
  ) => {
    setTemplate({
      id: templateId,
      title: name,
      template: content,
    });
    mutateAsync({
      title: name,
      status: 'PUBLIC',
      templateId: templateId,
    }).then(
      (doc) =>
        doc && navigate(`/document/${doc.id}/branch/${doc.mainBranchId}/edit`)
    );
  };

  return (
    <div className='relative px-20'>
      <Carousel
        opts={{
          align: 'start',
        }}
        className='w-full'
      >
        <CarouselContent className='-ml-4 py-2'>
          {templates &&
            templates.map((template) => (
              <CarouselItem
                key={template.id}
                onClick={() => {
                  createDocument(
                    template.id,
                    template.title,
                    convertToTiptapContent(template.template)
                  );
                }}
                className='pl-4 select-none basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/6'
              >
                <div className='group cursor-pointer'>
                  <div className='relative h-64 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden'>
                    {/* Template preview */}
                    <div className='absolute inset-0 flex flex-col p-6 overflow-hidden'>
                      <div className='text-xs text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-300 line-clamp-14'>
                        <ContentRenderer
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
                </div>
              </CarouselItem>
            ))}
        </CarouselContent>

        <CarouselPrevious className='-translate-x-1/2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-110 transition-all duration-200' />
        <CarouselNext className='translate-x-1/2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-110 transition-all duration-200' />
      </Carousel>
    </div>
  );
};

export default Templates;
