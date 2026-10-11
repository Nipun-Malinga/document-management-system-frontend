import { Button } from '@/components/ui/button';
import type { PageResponse } from '@/models/PageResponse';

interface Props {
  data?: Pick<PageResponse<unknown>, 'page' | 'totalPages' | 'totalElements' | 'hasPrevious' | 'hasNext'>;
  pending: boolean;
  onPage: (page: number) => void;
  label: string;
}

const CollectionPagination = ({ data, pending, onPage, label }: Props) => {
  if (!data) return null;
  return (
    <nav aria-label={`${label} pagination`} className='my-4 flex flex-wrap items-center justify-between gap-2 text-sm text-foreground'>
      <p role='status' className='tabular-nums'>
        {data.totalElements} items · Page {data.totalPages === 0 ? 0 : data.page + 1} of {data.totalPages}
      </p>
      <div className='flex gap-2'>
        <Button type='button' size='sm' variant='outline' disabled={pending || !data.hasPrevious} onClick={() => onPage(Math.max(0, data.page - 1))}>Previous</Button>
        <Button type='button' size='sm' variant='outline' disabled={pending || !data.hasNext} onClick={() => onPage(data.page + 1)}>Next</Button>
      </div>
    </nav>
  );
};

export default CollectionPagination;
