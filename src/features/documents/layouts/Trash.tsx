import { Breadcrumb, Container } from '@/components';
import { trashBreadcrumb } from '@/data/breadcrumb/HomeBreadcrumbs';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2 } from 'lucide-react';
import { TrashBranchTable, TrashDocumentTable } from '../components/trash';

const Trash = () => {
  return (
    <Container>
      <Breadcrumb links={trashBreadcrumb} />

      <div className='bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 overflow-hidden'>
        {/* Header */}
        <div className='px-6 py-4 border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900'>
          <div className='flex items-center gap-2'>
            <Trash2 className='w-5 h-5 text-gray-600 dark:text-gray-200' />
            <h2 className='text-lg font-semibold text-gray-900 dark:text-gray-300'>
              Trash
            </h2>
          </div>
          <p className='text-sm text-gray-500 mt-1'>
            Items will be permanently deleted after 30 days
          </p>
        </div>

        {/* Table */}
        <Tabs defaultValue='documents' className='px-4 py-2'>
          <TabsList>
            <TabsTrigger className='cursor-pointer' value='documents'>
              Documents
            </TabsTrigger>
            <TabsTrigger className='cursor-pointer' value='branches'>
              Branches
            </TabsTrigger>
          </TabsList>
          <TabsContent value='documents'>
            <TrashDocumentTable />
          </TabsContent>
          <TabsContent value='branches'>
            <TrashBranchTable />
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default Trash;
