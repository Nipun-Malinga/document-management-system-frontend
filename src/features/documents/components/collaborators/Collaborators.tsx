import useCollaborators from '@/hooks/document/collaboration/useCollaborators';
import { Users } from 'lucide-react';
import type { CollaboratorsResponse } from '@/models/Collaborator';
import Collaborator from './CollaboratorCard';

interface Props {
  documentId: string;
}

const collaboratorRenderer = (collaborators: CollaboratorsResponse) => {
  return (
    <div className='max-h-80 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent'>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
        {collaborators.data.map((collaborator) => (
          <Collaborator collaborator={collaborator} key={collaborator.userId} />
        ))}
      </div>
    </div>
  );
};

const Collaborators = ({ documentId }: Props) => {
  const { data } = useCollaborators(documentId);

  return (
    <div className='space-y-6'>
      {/* Current Collaborators Section */}
      {data?.data && data.data.length > 0 && (
        <div className='bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm'>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
                <Users className='w-5 h-5 text-blue-600 dark:text-blue-400' />
              </div>
              <div>
                <h3 className='text-base font-bold text-gray-900 dark:text-gray-100'>
                  Collaborators
                </h3>
                <p className='text-xs text-gray-500 dark:text-gray-400'>
                  People with access to this document
                </p>
              </div>
            </div>
            <span className='px-3 py-1 text-sm font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full border border-blue-200 dark:border-blue-800'>
              {data.data.length}
            </span>
          </div>
          {collaboratorRenderer(data)}
        </div>
      )}
    </div>
  );
};

export default Collaborators;
