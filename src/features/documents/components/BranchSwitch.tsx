import { useEffect, useRef, useState } from 'react';
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
  const { setBranchName, branchName } = useDocumentBranch();
  const navigate = useNavigate();
  const { data } = useBranches(documentId);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  if (!data) return null;

  const branches = data.data;

  return (
    <div className='relative inline-block' ref={dropdownRef}>
      <Button
        icon={FaCodeBranch}
        title={`Branches: ${branches.length}`}
        type='button'
        onClick={() => setOpen(!open)}
        className='h-7.5'
      />

      <div
        className={`absolute top-full left-0 bg-white dark:bg-slate-800 w-64 mt-2 py-2 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg overflow-hidden z-50 transition-all duration-200 ease-out ${
          open
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
        role='menu'
        aria-label='Branch selection menu'
      >
        <div className='px-3 py-2 border-b border-slate-200 dark:border-slate-700'>
          <p className='text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide'>
            Switch Branch
          </p>
        </div>

        <div className='max-h-80 overflow-y-auto px-2 py-1'>
          {branches.length === 0 ? (
            <p className='text-sm text-slate-500 dark:text-slate-400 px-3 py-2'>
              No branches available
            </p>
          ) : (
            branches.map((branch) => {
              const isActive = branchName === branch.branchName;

              return (
                <button
                  onClick={() => {
                    setOpen(false);
                    setBranchName(branch.branchName);
                    navigate(getEditorURI(documentId, branch.id, shared));
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    isActive
                      ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                  key={branch.id}
                  type='button'
                >
                  <div className='w-full flex flex-row justify-between items-center gap-2'>
                    <span
                      className={`text-sm truncate ${
                        isActive ? 'font-semibold' : 'font-normal'
                      }`}
                    >
                      {branch.branchName}
                    </span>
                    {isActive && (
                      <span className='shrink-0 w-2 h-2 rounded-full bg-emerald-500' />
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default BranchSwitch;