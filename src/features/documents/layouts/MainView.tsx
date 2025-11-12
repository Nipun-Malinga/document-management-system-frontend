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

const MainView = () => {
  const { data } = useUserDocuments();

  const filtered = data?.data.filter((item) => !item.trashed);
  const isEmpty = filtered && filtered.length;

  return (
    <>
      <Breadcrumb links={mainViewBreadcrumb} />

      {isEmpty ? (
        <DocumentGrid>
          {filtered.map((document, index) => (
            <DocumentCard document={document} key={index} />
          ))}
        </DocumentGrid>
      ) : (
        <Empty className='mt-20'>
          <EmptyHeader>
            <EmptyMedia variant='icon'>
              <FolderOpen />
            </EmptyMedia>
            <EmptyTitle>No Documents Yet</EmptyTitle>
            <EmptyDescription>
              You haven&apos;t created any documents yet. Get started by
              creating your first document.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className='flex gap-2'>
              <Button title='Create Project' />
              <Button title='Import Project' />
            </div>
          </EmptyContent>
        </Empty>
      )}
    </>
  );
};

export default MainView;
