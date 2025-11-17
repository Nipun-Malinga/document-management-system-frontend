import User from '@/features/users/components/User';
import type { Collaborator } from '@/models/Collaborator';
import { useEffect, useState } from 'react';

interface Props {
  collaborator: Collaborator;
}

const CollaboratorCard = ({ collaborator }: Props) => {
  const [status, setStatus] = useState<boolean>(false);

  useEffect(() => {
    setStatus(false);
  }, []);

  return (
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
          {status ? (
            <span className='flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400'>
              <span className='w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse' />
              online
            </span>
          ) : (
            <span className='flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-400'>
              <span className='w-1.5 h-1.5 rounded-full bg-gray-500 animate-pulse' />
              offline
            </span>
          )}
        </div>
        <p className='text-xs text-gray-500 dark:text-gray-400 truncate'>
          {collaborator.email}
        </p>
      </div>
    </div>
  );
};

export default CollaboratorCard;
