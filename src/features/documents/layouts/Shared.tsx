import { Breadcrumb, Container } from '@/components';
import { sharedWithMeBreadcrumb } from '@/data/breadcrumb/HomeBreadcrumbs';
import { useUserSharedDocuments } from '@/hooks/document';
import DocumentCard from '../components/DocumentCard';
import DocumentGrid from '../components/DocumentGrid';
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty';
import { FolderOpen } from 'lucide-react';

const Shared = () => {
  const { data } = useUserSharedDocuments();

  return (
    <Container>
      <Breadcrumb links={sharedWithMeBreadcrumb} />
      {data?.data && data.data.length > 0 ? (
        <DocumentGrid>
          {data.data.map((document, index) => (
            <DocumentCard document={document} key={index} />
          ))}
        </DocumentGrid>
      ) : (
        <Empty className='mt-5 md:mt-10 lg:mt-20'>
          <EmptyHeader>
            <EmptyMedia variant='icon'>
              <FolderOpen />
            </EmptyMedia>
            <EmptyTitle>No Documents Shared With You Yet</EmptyTitle>
            <EmptyDescription>
              You don't have any shared documents yet
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </Container>
  );
};

export default Shared;
