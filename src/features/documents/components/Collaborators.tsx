import useCollaborators from '@/hooks/document/collaboration/useCollaborators';
import type { CollaboratorsResponse } from '../../../models/Collaborator';
import { User } from '../../users';

interface Props {
  documentId: string;
}

const collaboratorRenderer = (collaborators: CollaboratorsResponse) => {
  return (
    <div className='max-h-72 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent grid grid-cols-1 sm:grid-cols-2 gap-3'>
      {collaborators.data.map((collaborator) => (
        <div
          key={collaborator.userId}
          className='flex items-center gap-3 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl p-3 transition-all duration-150 border border-gray-200 dark:border-gray-700'
        >
          <User userId={collaborator.userId} />
          <div className='flex-1 min-w-0'>
            <div className='flex items-center gap-2 mb-0.5'>
              <p className='font-semibold text-sm text-gray-900 dark:text-gray-100 capitalize truncate'>
                {collaborator.username}
              </p>
              <span className='flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400'>
                <span className='w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse' />
                online
              </span>
            </div>
            <p className='text-xs text-gray-500 dark:text-gray-400 truncate'>
              {collaborator.email}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

const Collaborators = ({ documentId }: Props) => {
  const { data } = useCollaborators(documentId);

  return (
    <>
      {data?.data && data.data.length > 0 && (
        <div className='space-y-3'>
          <div className='flex items-center gap-2'>
            <h3 className='text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide'>
              Collaborators
            </h3>
            <span className='px-2 py-0.5 text-xs font-semibold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full'>
              {data.data.length}
            </span>
          </div>
          {collaboratorRenderer(data)}
        </div>
      )}
    </>
  );
};

export default Collaborators;
