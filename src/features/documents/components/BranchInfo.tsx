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
    <div className='relative flex items-center gap-2 capitalize'>
      <Button
        icon={FaCodeBranch}
        title={`Branches: ${branches.length}`}
        type='button'
        theme='dark'
        onClick={() => setOpen(!open)}
      />

      <Badge text={branchName} theme='dark' />

      <div
        className={`absolute top-full left-0 mt-2 py-2 px-1 bg-white border border-gray-200 rounded-md shadow-lg min-w-[14rem] overflow-hidden z-50 transition duration-300 ease-in-out ${
          open
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        {branches.map((branch) => (
          <div onClick={() => {setOpen(false); setBranchName(branch.branchName)}} className='my-1 p-1 hover:bg-gray-900 hover:font-semibold text-gray-900 hover:text-white text-xs rounded-md transition duration-150 flex flex-row justify-between items-center cursor-pointer'>
            <span>{branch.branchName}</span>
            {branch.branchName === 'main' && (
              <span>default</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BranchInfo;
