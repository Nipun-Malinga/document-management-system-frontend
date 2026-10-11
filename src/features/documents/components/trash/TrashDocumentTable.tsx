import { Table } from '@/components';
import { useTrashedDocuments } from '@/hooks/document';
import useCollectionParams from '@/hooks/useCollectionParams';
import type { DocumentParams } from '@/models/PageResponse';
import CollectionResults from '../collections/CollectionResults';
import CollectionPagination from '../collections/CollectionPagination';
import CollectionFilters from '../collections/CollectionFilters';
import { documentSorts, statusField } from '../collections/collectionFilterOptions';
import TrashTableRow from './TrashTableRow';

const TrashDocumentTable = () => {
  const { params, update, setPage } = useCollectionParams<Omit<DocumentParams, 'favorite'>>();
  const query = useTrashedDocuments(params);
  return (
    <div className='px-3'>
      <CollectionFilters params={params} update={update} fields={[{ name: 'title', label: 'Exact title' }, statusField]} sorts={documentSorts} label='trashed documents' />
      <CollectionResults query={query} label='trashed documents'>
        {(items) => <Table titles={['Title', 'Reported Date', 'Actions']}>
          {items.map((trash) => <TrashTableRow trash={trash} key={trash.id} />)}
        </Table>}
      </CollectionResults>
      <p className='my-2 text-sm text-muted-foreground'>Dates are reported by the server and may not reflect when an item was trashed.</p>
      <CollectionPagination data={query.data} pending={query.isFetching} onPage={setPage} label='trashed documents' />
    </div>
  );
};

export default TrashDocumentTable;
