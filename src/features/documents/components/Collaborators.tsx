import { useCollaborators } from '../../../hooks/useCollaborators';
import type { CollaboratorsResponse } from '../../../models/Collaborator';
import { User } from '../../users';

interface Props {
  documentId: string;
}

const collaboratorRenderer = (collaborators: CollaboratorsResponse) => {
  return (
    <div className='max-h-25 overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 gap-3'>
      {collaborators.data.map((collaborator) => (
        <div
          key={collaborator.userId}
          className='flex items-center gap-2 bg-slate-100 dark:bg-slate-600 rounded-lg p-2 transition'
        >
          <User userId={collaborator.userId} />
          <div className='text-xs leading-tight'>
            <p className='font-medium text-slate-900 dark:text-slate-200 capitalize'>
              {collaborator.username}
              <span className='ml-1 text-green-500 font-normal'>online</span>
            </p>
            <p className='text-slate-500 dark:text-slate-300 text-[11px]'>{collaborator.email}</p>
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
        <div className='mt-3'>
          <p className='text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2'>
            Collaborators
          </p>
          {collaboratorRenderer(data)}
        </div>
      )}
    </>
  );
};

export default Collaborators;
