import { useCollaborators } from '../../../hooks/useCollaborators';
import type { CollaboratorsResponse } from '../../../models/Collaborator';
import User from '../../users/components/User';

interface Props {
  documentId: string;
}

const collaboratorRenderer = (collaborators: CollaboratorsResponse) => {
  return (
    <div className='max-h-40 overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 gap-3'>
      {collaborators.data.map((collaborator) => (
        <div
          key={collaborator.userId}
          className='flex items-center gap-2 bg-gray-50 hover:bg-gray-100 rounded-lg p-2 transition'
        >
          <User userId={collaborator.userId} />
          <div className='text-xs leading-tight'>
            <p className='font-medium text-gray-800 capitalize'>
              {collaborator.username}
              <span className='ml-1 text-green-500 font-normal'>online</span>
            </p>
            <p className='text-gray-500 text-[11px]'>{collaborator.email}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const Collaborators = ({ documentId }: Props) => {
  const { data } = useCollaborators(documentId);

  return (
    <div className='mt-3'>
      {data?.data && data.data.length > 0 && (
        <>
          <p className='text-sm font-semibold text-gray-700 mb-2'>
            Collaborators
          </p>
          {collaboratorRenderer(data)}
        </>
      )}
    </div>
  );
};

export default Collaborators;
