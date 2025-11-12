import { Table } from '@/components';
import { useTrashedDocuments } from '@/hooks/document';
import TrashTableRow from './TrashTableRow';

const TrashTable = () => {
  const { data, isLoading } = useTrashedDocuments();

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

export default TrashTable;
