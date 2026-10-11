import { HocuspocusProvider } from '@hocuspocus/provider';
import { useEffect, useState } from 'react';
import { Doc } from 'yjs';
import { assertSession, getSession, useSessionStore } from '@/states/sessionStore';
import { ensureAccessToken, refreshSession } from '@/services/apiService';

interface ProviderState {
  documentKey: string;
  epoch: number;
  provider: HocuspocusProvider;
}

const useProvider = (documentKey: string): HocuspocusProvider | null => {
  const epoch = useSessionStore((state) => state.epoch);
  const [connection, setConnection] = useState<ProviderState | null>(null);

  useEffect(() => {
    if (!getSession().user) return;
    const document = new Doc();
    let disposed = false;
    let renewPending = false;
    const provider = new HocuspocusProvider({
      url: import.meta.env.VITE_COLLABORATIVE_CRDT_SERVER_WEBSOCKET_URL ?? 'ws://localhost:1234',
      token: async () => {
        const token = await ensureAccessToken(epoch);
        assertSession(epoch);
        if (disposed) throw new Error('Collaboration provider disposed');
        return token;
      },
      name: documentKey,
      document,
      onDisconnect: () => resume(),
      onAuthenticationFailed: () => {
        if (disposed || getSession().epoch !== epoch) return;
        provider.disconnect();
        // Permission failures with a fresh token do not trigger an auth retry loop.
        if (getSession().expiresAt <= Date.now()) void refreshSession(epoch).catch(() => {});
      },
    });
    function resume() {
      if (!renewPending || disposed || getSession().epoch !== epoch || getSession().status !== 'authenticated') return;
      const socket = provider.configuration.websocketProvider;
      // disconnect() closes asynchronously; wait for onDisconnect before reopening.
      if (socket.status === 'connected' || socket.webSocket?.readyState === 2) return;
      renewPending = false;
      void provider.connect().catch(() => {});
    }
    const destroy = () => {
      if (disposed) return;
      disposed = true;
      provider.destroy();
      document.destroy();
    };
    const unsubscribe = useSessionStore.subscribe((state, previous) => {
      if (state.epoch !== epoch) destroy();
      else if (state.status === 'recovering') {
        renewPending = true;
        provider.disconnect();
      }
      else if (state.status === 'authenticated' && (state.token !== previous.token || state.status !== previous.status)) {
        renewPending = true;
        if (previous.status === 'authenticated') provider.disconnect();
        resume();
      }
    });
    setConnection({ documentKey, epoch, provider });
    return () => { unsubscribe(); destroy(); };
  }, [documentKey, epoch]);

  return connection?.documentKey === documentKey && connection.epoch === epoch ? connection.provider : null;
};
export default useProvider;
