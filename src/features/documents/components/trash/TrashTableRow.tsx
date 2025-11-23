import { Alert } from '@/components';
import {
  useDeleteBranch,
  useDeleteDocument,
  useRestoreBranch,
  useRestoreDocument,
} from '@/hooks/document';
import type { TrashBranch, TrashDocument } from '@/models/Trash';
import { FileText, GitBranch, Trash2, RotateCcw, Calendar } from 'lucide-react';

interface Props {
  trash: TrashDocument | TrashBranch;
}

const TrashTableRow = ({ trash }: Props) => {
  const isBranch = 'branch' in trash;
  const itemName = isBranch ? trash.branch.branchName : trash.document.title;
  const itemType = isBranch ? 'Branch' : 'Document';

  const { mutate: restoreDocument } = useRestoreDocument(
    !isBranch ? trash.document.id : ''
  );

  const { mutate: restoreBranch } = useRestoreBranch(
    isBranch ? trash.branch.documentId : '',
    isBranch ? trash.branch.id : ''
  );

  const { mutate: deleteDocument } = useDeleteDocument(
    !isBranch ? trash.document.id : ''
  );

  const { mutate: deleteBranch } = useDeleteBranch(
    isBranch ? trash.branch.documentId : '',
    isBranch ? trash.branch.id : ''
  );

  const handleRestore = () => {
    isBranch ? restoreBranch() : restoreDocument();
  };

  const handleDelete = () => {
    isBranch ? deleteBranch() : deleteDocument();
  };

  return (
    <tr className='border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150'>
      <td className='px-6 py-4'>
        <div className='flex items-center gap-3'>
          <div
            className={`p-2 rounded-lg shrink-0 ${
              isBranch
                ? 'bg-purple-50 dark:bg-purple-900/20'
                : 'bg-blue-50 dark:bg-blue-900/20'
            }`}
          >
            {isBranch ? (
              <GitBranch className='w-5 h-5 text-purple-600 dark:text-purple-400' />
            ) : (
              <FileText className='w-5 h-5 text-blue-600 dark:text-blue-400' />
            )}
          </div>
          <div className='flex flex-col min-w-0'>
            <span className='text-sm font-semibold text-gray-900 dark:text-gray-100 truncate'>
              {itemName}
            </span>
            <span className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>
              {itemType}
            </span>
          </div>
        </div>
      </td>

      <td className='px-6 py-4 whitespace-nowrap'>
        <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'>
          <Calendar className='w-4 h-4' />
          <span>{trash.addedDate}</span>
        </div>
      </td>

      <td className='px-6 py-4 whitespace-nowrap text-right'>
        <div className='flex items-center justify-end gap-2'>
          <Alert
            trigger={
              <button className='flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-lg transition-all duration-150 border border-emerald-200 dark:border-emerald-800'>
                <RotateCcw className='w-4 h-4' />
                Restore
              </button>
            }
            title='Restore Item?'
            description={`Do you want to restore this ${itemType.toLowerCase()}? It will be moved back to your active items.`}
            action='Restore'
            onClick={handleRestore}
          />

          <Alert
            trigger={
              <button className='flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all duration-150 border border-red-200 dark:border-red-800'>
                <Trash2 className='w-4 h-4' />
                Delete
              </button>
            }
            title='Permanently Delete?'
            description={`This action cannot be undone. This will permanently delete your ${itemType.toLowerCase()} and remove all data from our servers.`}
            action='Delete Permanently'
            onClick={handleDelete}
          />
        </div>
      </td>
    </tr>
  );
};

export default TrashTableRow;
