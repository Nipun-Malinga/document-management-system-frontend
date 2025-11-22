import type { IMessage } from '@stomp/stompjs';
import { useEffect } from 'react';
import WebSocketService from '../../../services/websocketService';
import useDocumentOnlineUsers from '../../../states/useDocumentOnlineUser';

/*
  TODO: FETCH THE USER INFORMATION FROM THE SERVER BASED ON USER ID
  TODO: LIMIT THE ONLINE USERS VIEW LIMIT
  FIXME: GIVE USERS SPECIFIC COLOR BASED ON THE INDEX
*/

interface Props {
  documentId: string;
}

const OnlineUsers = ({ documentId }: Props) => {
  const { users, addValue } = useDocumentOnlineUsers();

  const ws = WebSocketService.getInstance();
  const client = ws.getClient();

  useEffect(() => {
    if (!client) return;

    const initialUsers = () => {
      const subscription = ws.subscribe(
        `/app/document/${documentId}/users`,
        (payload: IMessage) => {
          try {
            console.log(payload.body);
            const userList = JSON.parse(payload.body) as number[];
            addValue(documentId, userList);
          } catch (err) {
            console.error('Invalid message format:', payload.body);
          }
        }
      );

      return subscription;
    };

    const dynamicUsers = () => {
      const subscription = ws.subscribe(
        `/document/${documentId}/users`,
        (payload: IMessage) => {
          try {
            console.log(payload.body);
            const userList = JSON.parse(payload.body) as number[];
            addValue(documentId, userList);
          } catch (err) {
            console.error('Invalid message format:', payload.body);
          }
        }
      );

      return subscription;
    };

    ws.subscribeManager(initialUsers);
    ws.subscribeManager(dynamicUsers);
  }, [client, documentId]);

  return (
    <div className='relative'>
      {users.get(documentId)?.map((user, index) => (
        <div style={calculatePosition(index)} key={user}>
          {/* <User userId={user} /> */}
        </div>
      ))}
    </div>
  );
};

function calculatePosition(position: number): React.CSSProperties {
  return {
    zIndex: position,
    left: `${position}rem`,
    position: 'absolute',
  };
}

export default OnlineUsers;
