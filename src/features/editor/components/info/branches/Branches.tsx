import useCollectionParams from '@/hooks/useCollectionParams';
import type { BranchParams } from '@/models/PageResponse';
import CollectionResults from '@/features/documents/components/collections/CollectionResults';
import CollectionPagination from '@/features/documents/components/collections/CollectionPagination';
import CollectionFilters from '@/features/documents/components/collections/CollectionFilters';
import { branchSorts, statusField } from '@/features/documents/components/collections/collectionFilterOptions';
import {
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { useBranches } from '@/hooks/document';
import { GitBranch } from 'lucide-react';
import { useParams } from 'react-router-dom';
import InfoDrawerBody from '../InfoDrawerBody';
import BranchCard from './BranchCard';
import BranchCreateForm from './BranchCreateForm';

const Branches = () => {
  const { documentId } = useParams();
  const { params, update, setPage } = useCollectionParams<BranchParams>(documentId);
  const query = useBranches(documentId ?? '', params);

  return (
    <>
      <DrawerHeader className='border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'>
        <div className='flex items-center gap-3 mb-2'>
          <div className='p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
            <GitBranch className='w-5 h-5 text-blue-600 dark:text-blue-400' />
          </div>
          <div>
            <DrawerTitle className='text-xl font-bold text-gray-900 dark:text-gray-100'>
              Branches
            </DrawerTitle>
          </div>
        </div>
        <DrawerDescription className='text-gray-600 dark:text-gray-400'>
          Branch Description
        </DrawerDescription>
      </DrawerHeader>
      <InfoDrawerBody emptyTitle='Branches' emptyDescription=''>
        <BranchCreateForm />
        <CollectionFilters key={documentId} params={params} update={update} fields={[{ name: 'branchName', label: 'Exact branch name' }, statusField]} sorts={branchSorts} label='branches' />
        <CollectionResults query={query} label='branches'>
          {(items) => items.map((branch) => <BranchCard branch={branch} key={branch.id} />)}
        </CollectionResults>
        <CollectionPagination data={query.data} pending={query.isFetching} onPage={setPage} label='branches' />
      </InfoDrawerBody>
    </>
  );
};

export default Branches;
