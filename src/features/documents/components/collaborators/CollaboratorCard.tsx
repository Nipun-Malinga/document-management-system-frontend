import User from '@/features/users/components/User';
import type { Collaborator } from '@/models/Collaborator';
import WebSocketService from '@/services/websocketService';
import type { IMessage } from '@stomp/stompjs';
import { useSessionStore } from '@/states/sessionStore';
import { useEffect, useState } from 'react';

interface Props {
  collaborator: Collaborator;
}

const CollaboratorCard = ({ collaborator }: Props) => {
  const [status, setStatus] = useState<boolean>(false);

  const epoch = useSessionStore((state) => state.epoch);
  const userId = collaborator.userId;

  useEffect(() => {
    const ws = WebSocketService.getInstance();
    setStatus(false);
    const receive = (payload: IMessage) => {
      try {
        const value: unknown = JSON.parse(payload.body);
        if (typeof value === 'boolean') setStatus(value);
      } catch {
        console.error('Invalid user status message');
      }
    };
    const reset = () => setStatus(false);
    const unsubscribeUpdates = ws.subscribe(`/user/${userId}/status`, receive, reset);
    const unsubscribeInitial = ws.subscribe(`/app/user/${userId}/status`, receive, reset);
    return () => {
      unsubscribeInitial();
      unsubscribeUpdates();
    };
  }, [userId, epoch]);

  return (
    <div
      key={collaborator.userId}
      className='flex items-center gap-3 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl p-3 transition-all duration-150 border border-gray-200 dark:border-gray-700'
    >
      <User username={collaborator.username} />
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
