import {
  useDeleteBranch,
  useDeleteDocument,
  useRestoreBranch,
  useRestoreDocument,
} from '@/hooks/document';
import type { TrashBranch, TrashDocument } from '@/models/Trash';
import {
  AlertCircle,
  FileText,
  GitBranch,
  RotateCcw,
  Trash2,
} from 'lucide-react';

interface Props {
  trash: TrashDocument | TrashBranch;
}

const TrashTableRow = ({ trash }: Props) => {
  const { mutate: restoreDocument } = useRestoreDocument(
    'document' in trash ? trash.document.id : ''
  );

  const { mutate: restoreBranch } = useRestoreBranch(
    'branch' in trash ? trash.branch.documentId : '',
    'branch' in trash ? trash.branch.id : ''
  );

  const { mutate: deleteDocument } = useDeleteDocument(
    'document' in trash ? trash.document.id : ''
  );

  const { mutate: deleteBranch } = useDeleteBranch(
    'branch' in trash ? trash.branch.documentId : '',
    'branch' in trash ? trash.branch.id : ''
  );

  return (
    <tr className='bg-slate-50 dark:bg-slate-900!'>
      <td className='px-6 py-4'>
        <div className='flex items-center gap-3'>
          <div className='flex flex-col'>
            <span className='text-sm font-medium text-slate-900 dark:text-slate-300'>
              {'branch' in trash
                ? trash.branch.branchName
                : trash.document.title}
            </span>
          </div>
          <div className='shrink-0 rounded flex items-center justify-center gap-4'>
            <AlertCircle className='w-4 h-4 text-red-400' />
            {'branch' in trash ? (
              <GitBranch className='w-4 h-4 text-blue-400' />
            ) : (
              <FileText className='w-4 h-4 text-blue-400' />
            )}
          </div>
        </div>
      </td>
      <td className='px-6 py-4 whitespace-nowrap'>
        <span className='text-sm text-slate-500'>{trash.addedDate}</span>
      </td>
      <td className='px-6 py-4 whitespace-nowrap text-right'>
        <div className='flex items-center justify-end gap-2'>
          <button
            onClick={() => {
              'branch' in trash ? restoreBranch() : restoreDocument();
            }}
            className='inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors cursor-pointer'
          >
            <RotateCcw className='w-4 h-4' />
            Restore
          </button>
          <button
            onClick={() => {
              'branch' in trash ? deleteBranch() : deleteDocument();
            }}
            className='inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors cursor-pointer'
          >
            <Trash2 className='w-4 h-4' />
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default TrashTableRow;
