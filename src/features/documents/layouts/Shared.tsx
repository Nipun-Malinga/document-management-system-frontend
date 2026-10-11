import useCollectionParams from '@/hooks/useCollectionParams';
import type { SharedDocumentParams } from '@/models/PageResponse';
import CollectionResults from '../components/collections/CollectionResults';
import CollectionPagination from '../components/collections/CollectionPagination';
import CollectionFilters from '../components/collections/CollectionFilters';
import { documentSorts, statusField, permissionField } from '../components/collections/collectionFilterOptions';
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
  const { params, update, setPage } = useCollectionParams<SharedDocumentParams>();
  const query = useUserSharedDocuments(params);

  return (
    <Container>
      <Breadcrumb links={sharedWithMeBreadcrumb} />
      <CollectionFilters params={params} update={update} fields={[{ name: 'title', label: 'Exact title' }, statusField, permissionField]} sorts={documentSorts} label='shared documents' />
      <CollectionResults query={query} label='shared documents' empty={Object.entries(params).some(([key, value]) => !['page', 'size', 'sort'].includes(key) && value !== undefined && value !== '') ? undefined : (
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
      )}>
        {(items) => (
          <DocumentGrid>
            {items.map((document) => (
              <DocumentCard document={document} key={document.id} />
            ))}
          </DocumentGrid>
        )}
      </CollectionResults>
      <CollectionPagination data={query.data} pending={query.isFetching} onPage={setPage} label='shared documents' />
    </Container>
  );
};

export default Shared;
