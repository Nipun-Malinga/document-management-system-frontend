import { Breadcrumb, Button } from '@/components';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { mainViewBreadcrumb } from '@/data/breadcrumb/HomeBreadcrumbs';
import { useUserDocuments } from '@/hooks/document';
import { FolderOpen } from 'lucide-react';
import DocumentCard from '../components/DocumentCard';
import DocumentGrid from '../components/DocumentGrid';
import Templates from '../components/Templates';

const MainView = () => {
  const { data } = useUserDocuments();

  const filtered = data?.data ? data.data.filter((item) => !item.trashed) : [];
  const hasDocuments = filtered.length > 0;

  return (
    <>
      <Breadcrumb links={mainViewBreadcrumb} />

      <p className='font-bold text-sm mt-6'>Templates</p>

      <Templates />

      <p className='font-bold text-sm mt-6'>All Documents</p>

      {hasDocuments ? (
        <DocumentGrid>
          {filtered.map((document, index) => (
            <DocumentCard document={document} key={index} />
          ))}
        </DocumentGrid>
      ) : (
        <Empty className='mt-5 md:mt-10 lg:mt-20'>
          <EmptyHeader>
            <EmptyMedia variant='icon'>
              <FolderOpen />
            </EmptyMedia>
            <EmptyTitle>No Documents Yet</EmptyTitle>
            <EmptyDescription>
              You haven't created any documents yet. Start by creating your
              first document.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </>
  );
};

export default MainView;
