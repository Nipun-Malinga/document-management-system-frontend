import useCollaborators from '@/hooks/document/collaboration/useCollaborators';
import type { CollaboratorsResponse } from '../../../../models/Collaborator';
import Collaborator from './CollaboratorCard';

interface Props {
  documentId: string;
}

const collaboratorRenderer = (collaborators: CollaboratorsResponse) => {
  return (
    <div className='max-h-72 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent grid grid-cols-1 sm:grid-cols-2 gap-3'>
      {collaborators.data.map((collaborator) => (
        <Collaborator collaborator={collaborator} key={collaborator.userId} />
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
