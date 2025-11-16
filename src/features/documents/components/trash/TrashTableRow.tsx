import { Alert } from '@/components';
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
  Trash2,
  RotateCcw
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
        <div className='flex items-center justify-end gap-4'>
          <Alert
            trigger={
              <span className='text-blue-400 flex items-center gap-1'>
                <RotateCcw className='w-4 h-4' />
                Restore
              </span>
            }
            title='Are you absolutely sure?'
            description='Do you want to recover this document?'
            action='Delete'
            onClick={() => {
              'branch' in trash ? restoreBranch() : restoreDocument();
            }}
          />

          <Alert
            trigger={
              <span className='text-red-400 flex items-center gap-1'>
                <Trash2 className='w-4 h-4' />
                Delete
              </span>
            }
            title='Are you absolutely sure?'
            description='This action cannot be undone. This will permanently delete your document and remove your data from our servers.'
            action='Delete'
            onClick={() => {
              'branch' in trash ? deleteBranch() : deleteDocument();
            }}
          />
        </div>
      </td>
    </tr>
  );
};

export default TrashTableRow;
