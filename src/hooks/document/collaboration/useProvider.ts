import { HocuspocusProvider } from '@hocuspocus/provider';
import { Doc } from 'yjs';

const useProvider = (documentKey: string, ydoc: Doc) => {
  return new HocuspocusProvider({
    url:
      import.meta.env.VITE_COLLABORATIVE_CRDT_SERVER_WEBSOCKET_URL ??
      'ws://localhost:1234',
    token: localStorage.getItem('jwt-access-token'),
    name: documentKey,
    document: ydoc,
  });
};

export default useProvider;
