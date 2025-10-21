import { FaCodeBranch } from 'react-icons/fa6';
import { Button, Badge } from '../../../components';
import { useBranches } from '../../../hooks/useBranches';

interface Props {
  documentId: string;
}

const BranchInfo = ({ documentId }: Props) => {
  const { data } = useBranches(documentId);

  return (
    <div className='flex gap-1'>
      {data?.data && (
        <Button
          icon={FaCodeBranch}
          title={`Branches: ${data.data && data.data.length}`}
          type='button'
          theme='dark'
        />
      )}
      <Badge text={'main'} theme='dark' />
    </div>
  );
};

export default BranchInfo;
