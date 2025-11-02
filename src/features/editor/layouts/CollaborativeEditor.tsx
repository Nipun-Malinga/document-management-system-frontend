import type { IMessage } from '@stomp/stompjs';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import WebSocketService from '../../../services/websocketService';
import EditorContainer from '../components/EditorContainer';
import MainEditor from '../components/MainEditor';

const CollaborativeEditor = () => {
  const { documentId, branchId } = useParams();

  const ws = WebSocketService.getInstance();
  const client = ws.getClient();

  useEffect(() => {
    if (!client) return;

    const initialUsers = () => {
      const subscription = ws.subscribe(
        `/document/${documentId}/branch/${branchId}/broadcastStatus`,
        (payload: IMessage) => {
          try {
            const payloadJson = JSON.parse(payload.body);
          } catch (err) {}
        }
      );

      return subscription;
    };

    const dynamicUsers = () => {
      const subscription = ws.subscribe(
        `/app/document/${documentId}/branch/${branchId}/broadcastStatus`,
        (payload: IMessage) => {
          try {
            const payloadJson = JSON.parse(payload.body);
          } catch (err) {}
        }
      );

      return subscription;
    };

    ws.subscribeManager(initialUsers);
    ws.subscribeManager(dynamicUsers);
  }, [client, documentId]);

  const saveChanges = (content: string) => {
    ws.send(
      `/app/document/${documentId}/branch/${branchId}/accept-changes`,
      JSON.stringify({
        content: JSON.stringify(content),
      })
    );
  };

  if (!(documentId && branchId)) return null;

  return (
    <EditorContainer>
      <MainEditor
        enableAutoSaver={false}
        documentId={documentId}
        branchId={branchId}
        content={''}
      />
    </EditorContainer>
  );
};

export default CollaborativeEditor;
