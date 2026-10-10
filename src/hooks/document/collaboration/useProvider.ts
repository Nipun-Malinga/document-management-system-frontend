import { HocuspocusProvider } from '@hocuspocus/provider';
import { useEffect, useState } from 'react';
import { Doc } from 'yjs';

interface ProviderState {
  documentKey: string;
  provider: HocuspocusProvider;
}

const useProvider = (documentKey: string): HocuspocusProvider | null => {
  const [connection, setConnection] = useState<ProviderState | null>(null);

  useEffect(() => {
    const document = new Doc();
    const provider = new HocuspocusProvider({
      url:
        import.meta.env.VITE_COLLABORATIVE_CRDT_SERVER_WEBSOCKET_URL ??
        'ws://localhost:1234',
      token: localStorage.getItem('jwt-access-token'),
      name: documentKey,
      document,
    });

    setConnection({ documentKey, provider });

    return () => {
      provider.destroy();
      document.destroy();
    };
  }, [documentKey]);

  return connection?.documentKey === documentKey ? connection.provider : null;
};

export default useProvider;
