import { Table } from '@/components';
import { useTrashedBranches } from '@/hooks/document';
import TrashTableRow from './TrashTableRow';

const TrashBranchTable = () => {
  const { data, isLoading } = useTrashedBranches();

  return (
    <Table titles={['Title', 'Added Date', 'Actions']}>
      {!isLoading && data?.data && data.data.length > 0 && (
        <>
          {data.data.map((trash, index) => (
            <TrashTableRow trash={trash} key={index} />
          ))}
        </>
      )}
    </Table>
  );
};

export default TrashBranchTable;
