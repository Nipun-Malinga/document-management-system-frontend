import DocumentSearch from '../components/DocumentSearch';
import useCollectionParams from '@/hooks/useCollectionParams';
import type { DocumentParams } from '@/models/PageResponse';
import CollectionResults from '../components/collections/CollectionResults';
import CollectionPagination from '../components/collections/CollectionPagination';
import CollectionFilters from '../components/collections/CollectionFilters';
import { documentSorts, statusField } from '../components/collections/collectionFilterOptions';
import { Breadcrumb } from '@/components';
import {
  Empty,
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
  const { params, update, setPage } = useCollectionParams<DocumentParams>();
  const query = useUserDocuments(params);

  return (
    <>
      <Breadcrumb links={mainViewBreadcrumb} />

      <p className='font-bold text-sm mt-6'>Templates</p>

      <Templates />

      <p className='font-bold text-sm mt-6'>All Documents</p>

      <DocumentSearch title={params.title} onSearch={(title) => update({ title })} />
      <CollectionFilters params={params} update={update} fields={[{ name: 'title', label: 'Title' }, statusField, { name: 'favorite', label: 'Favorite', options: [['true', 'Yes'], ['false', 'No']] }]} sorts={documentSorts} label='documents' />
      <CollectionResults query={query} label='documents' empty={Object.entries(params).some(([key, value]) => !['page', 'size', 'sort'].includes(key) && value !== undefined && value !== '') ? undefined : (
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
      )}>
        {(items) => (
          <DocumentGrid>
            {items.map((document) => (
              <DocumentCard document={document} key={document.id} />
            ))}
          </DocumentGrid>
        )}
      </CollectionResults>
      <CollectionPagination data={query.data} pending={query.isFetching} onPage={setPage} label='documents' />
    </>
  );
};

export default MainView;
