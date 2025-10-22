import { FaCodeBranch } from 'react-icons/fa6';
import { Badge, Button } from '../../../components';
import { useBranches } from '../../../hooks/useBranches';
import useBranch from '../../../states/useBranch';
import { useState } from 'react';

interface Props {
  documentId: string;
}

const BranchInfo = ({ documentId }: Props) => {
  const { data } = useBranches(documentId);
  const { branchName, setBranchName } = useBranch();
  const [open, setOpen] = useState(false);

  if (!data) return null;

  const branches = data.data;

  return (
    <div className='relative flex items-center gap-2'>
      <Button
        icon={FaCodeBranch}
        title={`Branches: ${branches.length}`}
        type='button'
        theme='dark'
        onClick={() => setOpen(!open)}
      />

      <Badge text={branchName} theme='dark' />

      <div
        className={`absolute top-full left-0 bg-gray-900 mt-2 py-2 px-1 border border-gray-200 rounded-md shadow-lg min-w-56 overflow-hidden z-50 transition duration-300 ease-in-out ${
          open
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        {branches.map((branch) => (
          <Button
            theme='dark'
            onClick={() => {
              setOpen(false);
              setBranchName(branch.branchName);
            }}
            disabled={branch.branchName === branchName}
            className='w-full'
            node={
              <div className='w-full flex justify-between'>
                <span>{branch.branchName}</span>
                {branch.branchName === 'main' && <span>default</span>}
              </div>
            }
          />
        ))}
      </div>
    </div>
  );
};

export default BranchInfo;
