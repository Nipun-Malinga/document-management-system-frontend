import { Breadcrumb, Container } from '@/components';
import { trashBreadcrumb } from '@/data/breadcrumb/HomeBreadcrumbs';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, Clock } from 'lucide-react';
import { TrashBranchTable, TrashDocumentTable } from '../components/trash';
import { useTrashBranchCount, useTrashDocumentCount } from '@/hooks/sidebar';

const Trash = () => {
  const { data: trashDocumentCount } = useTrashDocumentCount();
  const { data: trashBranchCount } = useTrashBranchCount();

  return (
    <Container>
      <Breadcrumb links={trashBreadcrumb} />

      <div className='bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200'>
        {/* Header with gradient accent */}
        <div className='relative px-6 py-6 border-b border-gray-200 dark:border-gray-700'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='p-2.5 bg-red-50 dark:bg-red-900/20 rounded-lg ring-1 ring-red-100 dark:ring-red-800/50'>
                <Trash2 className='w-5 h-5 text-red-600 dark:text-red-400' />
              </div>
              <div>
                <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight'>
                  Trash
                </h2>
                <div className='flex items-center gap-1.5 mt-1'>
                  <Clock className='w-3.5 h-3.5 text-gray-400 dark:text-gray-500' />
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    Items auto-delete after 30 days
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs with modern styling */}
        <Tabs defaultValue='documents' className=''>
          <div className='px-6 pt-4 pb-2 bg-gray-50 dark:bg-gray-900'>
            <TabsList className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-1 rounded-lg shadow-sm'>
              <TabsTrigger
                className='cursor-pointer data-[state=active]:bg-gray-900 data-[state=active]:text-white dark:data-[state=active]:bg-gray-100 dark:data-[state=active]:text-gray-900 data-[state=active]:shadow-sm transition-all duration-200 font-medium'
                value='documents'
              >
                Documents {trashDocumentCount?.count ?? 0}
              </TabsTrigger>
              <TabsTrigger
                className='cursor-pointer data-[state=active]:bg-gray-900 data-[state=active]:text-white dark:data-[state=active]:bg-gray-100 dark:data-[state=active]:text-gray-900 data-[state=active]:shadow-sm transition-all duration-200 font-medium'
                value='branches'
              >
                Branches {trashBranchCount?.count ?? 0}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value='documents' className='mt-0'>
            <TrashDocumentTable />
          </TabsContent>
          <TabsContent value='branches' className='mt-0'>
            <TrashBranchTable />
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default Trash;
