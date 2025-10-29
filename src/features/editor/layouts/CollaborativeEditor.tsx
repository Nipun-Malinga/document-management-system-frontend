import type { IMessage } from '@stomp/stompjs';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Descendant } from 'slate';
import type { ContentResponse } from '../../../models/Content';
import WebSocketService from '../../../services/websocketService';
import type { customElement } from '../types';
import { convertToSlateElement } from '../utils';
import MainEditor from './MainEditor';

let timeout = 0;

const CollaborativeEditor = () => {
  const [content, setContent] = useState<customElement[]>();
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
            const payloadJson = JSON.parse(payload.body) as ContentResponse;
            setContent(convertToSlateElement(payloadJson.content));
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
            const payloadJson = JSON.parse(payload.body) as ContentResponse;
            setContent(convertToSlateElement(payloadJson.content));
          } catch (err) {}
        }
      );

      return subscription;
    };

    ws.subscribeManager(initialUsers);
    ws.subscribeManager(dynamicUsers);
  }, [client, documentId]);

  if (!content) return null;

  const saveChanges = (content: Descendant[]) => {
    try {
      clearTimeout(timeout);

      timeout = setTimeout(() => {
        ws.send(
          `/app/document/${documentId}/branch/${branchId}/accept-changes`,
          JSON.stringify({
            content: JSON.stringify(content),
          })
        );
      }, 5000);
    } catch (err) {
      console.error('Failed to pase document content data to json');
    }
  };

  return (
    <div>
      <MainEditor data={content} onChange={saveChanges} />
    </div>
  );
};

export default CollaborativeEditor;
