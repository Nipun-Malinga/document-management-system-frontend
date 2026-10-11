import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import type { PageResponse } from '@/models/PageResponse';
import { collectionErrorMessage } from '@/utils/collectionUtils';

export interface CollectionQuery<T> {
  data?: PageResponse<T>;
  isPending: boolean;
  isFetching: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => unknown;
}

interface Props<T> {
  query: CollectionQuery<T>;
  label: string;
  empty?: ReactNode;
  children: (items: T[]) => ReactNode;
}

const CollectionResults = <T,>({ query, label, empty, children }: Props<T>) => {
  if (query.isError) return (
    <div role='alert' className='my-4 space-y-2 text-sm text-foreground'>
      <p>{collectionErrorMessage(query.error, label)}</p>
      <Button type='button' variant='outline' onClick={() => { void query.refetch(); }} disabled={query.isFetching}>Try again</Button>
    </div>
  );
  if (query.isPending || !query.data) return <p role='status' className='my-4 text-sm text-muted-foreground'>Loading {label}…</p>;
  if (!query.data.content.length && query.data.page > 0) return (
    <p role='status' className='my-4 text-sm text-muted-foreground'>No {label} on this page. Use Previous to return to earlier results.</p>
  );
  if (!query.data.content.length) return <>{empty ?? <p role='status' className='my-4 text-sm text-muted-foreground'>No {label} match these filters.</p>}</>;
  return <div aria-busy={query.isFetching}>{children(query.data.content)}</div>;
};

export default CollectionResults;
