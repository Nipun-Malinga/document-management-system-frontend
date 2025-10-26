import { useState } from 'react';
import { FaCodeBranch } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components';
import { useBranches } from '../../../hooks/useBranches';
import useDocumentBranch from '../../../states/useDocumentBranch';
import { getEditorURI } from '../services';

interface Props {
  documentId: string;
  shared: boolean;
}

const BranchSwitch = ({ documentId, shared }: Props) => {
  const [open, setOpen] = useState(false);
  const { setBranchName } = useDocumentBranch();
  const navigate = useNavigate();
  const { data } = useBranches(documentId);

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

      <div
        className={`absolute top-full left-0 bg-gray-900 w-60 mt-1.5 p-2 space-y-1 border border-gray-200 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] overflow-hidden z-10 transition duration-300 ease-in-out ${
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
              navigate(getEditorURI(documentId, branch.id, shared));
            }}
            node={
              <p className='w-full flex flex-row justify-between items-start'>
                {branch.branchName}
              </p>
            }
            className='w-full'
            key={branch.id}
          />
        ))}
      </div>
    </div>
  );
};

export default BranchSwitch;
