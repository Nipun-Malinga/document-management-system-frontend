import { act, renderHook, waitFor } from '@testing-library/react';
import type { HocuspocusProviderConfiguration } from '@hocuspocus/provider';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { axiosInstance } from '@/services/apiService';
import { commitRefresh, endSession, getSession, markRecovering, replaceAccessToken } from '@/states/sessionStore';
import { claims, tokenFor } from '../../../fixtures';
import useProvider from '@/hooks/document/collaboration/useProvider';

const mocks = vi.hoisted(() => ({ providers: [] as FakeProvider[] }));
class FakeProvider {
  configuration = { websocketProvider: { status: 'connected', webSocket: { readyState: 1 } } };
  document;
  options: HocuspocusProviderConfiguration;
  constructor(options: HocuspocusProviderConfiguration) {
    this.options = options;
    this.document = options.document!;
    mocks.providers.push(this);
  }
  disconnect = vi.fn(() => { this.configuration.websocketProvider.webSocket.readyState = 2; });
  connect = vi.fn(async () => {
    this.configuration.websocketProvider.status = 'connected';
    this.configuration.websocketProvider.webSocket.readyState = 1;
  });
  destroy = vi.fn();
  close() {
    this.configuration.websocketProvider.status = 'disconnected';
    this.configuration.websocketProvider.webSocket.readyState = 3;
    this.options.onDisconnect?.({ event: {} as CloseEvent });
  }
  async token() {
    const value = this.options.token;
    if (typeof value !== 'function') throw new Error('Expected token callback');
    return value();
  }
}
vi.mock('@hocuspocus/provider', () => ({ HocuspocusProvider: class {
  constructor(options: HocuspocusProviderConfiguration) { return new FakeProvider(options); }
} }));
const originalAdapter = axiosInstance.defaults.adapter;
beforeEach(() => { mocks.providers.length = 0; replaceAccessToken(tokenFor()); });
afterEach(() => { axiosInstance.defaults.adapter = originalAdapter; });

describe('Hocuspocus session lifecycle', () => {
  it('uses fresh token callbacks and preserves the provider/Y.Doc across refresh, including delayed socket close', async () => {
    const { result } = renderHook(() => useProvider('documents/doc/branches/main'));
    const provider = mocks.providers[0];
    const document = provider.document;
    expect(provider.options.name).toBe('documents/doc/branches/main');
    expect(await provider.token()).toBe(tokenFor());
    const epoch = getSession().epoch;
    act(() => markRecovering(epoch));
    expect(provider.disconnect).toHaveBeenCalledOnce();
    const next = tokenFor({ ...claims, exp: claims.exp + 3600 });
    act(() => commitRefresh(next, epoch));
    expect(provider.connect).not.toHaveBeenCalled();
    act(() => provider.close());
    expect(provider.connect).toHaveBeenCalledOnce();
    expect(result.current).toBe(provider);
    expect(provider.document).toBe(document);
    expect(provider.destroy).not.toHaveBeenCalled();
    expect(await provider.token()).toBe(next);
  });

  it('reconnects the same provider on cross-tab renewal without replacing the Y.Doc', async () => {
    const { result } = renderHook(() => useProvider('documents/doc/branches/main'));
    const provider = mocks.providers[0];
    const document = provider.document;
    const next = tokenFor({ ...claims, exp: claims.exp + 3600 });
    act(() => commitRefresh(next, getSession().epoch));
    expect(provider.disconnect).toHaveBeenCalledOnce();
    act(() => provider.close());
    expect(provider.connect).toHaveBeenCalledOnce();
    expect(result.current).toBe(provider);
    expect(provider.document).toBe(document);
    expect(await provider.token()).toBe(next);
  });

  it('destroys provider and document on branch changes and logout exactly once', () => {
    const { result, rerender, unmount } = renderHook(({ room }) => useProvider(room), { initialProps: { room: 'documents/doc/branches/main' } });
    const first = mocks.providers[0];
    const destroyDocument = vi.spyOn(first.document, 'destroy');
    rerender({ room: 'documents/doc/branches/next' });
    expect(first.destroy).toHaveBeenCalledOnce();
    expect(destroyDocument).toHaveBeenCalledOnce();
    const next = mocks.providers[1];
    expect(result.current).toBe(next);
    const destroyNextDocument = vi.spyOn(next.document, 'destroy');
    act(() => endSession());
    expect(next.destroy).toHaveBeenCalledOnce();
    expect(destroyNextDocument).toHaveBeenCalledOnce();
    expect(result.current).toBeNull();
    unmount();
    expect(next.destroy).toHaveBeenCalledOnce();
  });

  it('never gives account B credentials to a prior account provider with pending token recovery', async () => {
    renderHook(() => useProvider('documents/doc/branches/main'));
    const providerA = mocks.providers[0];
    let finish!: () => void;
    const gate = new Promise<void>((resolve) => { finish = resolve; });
    const adapter = vi.fn(async (config) => {
      await gate;
      return { data: { token: tokenFor() }, status: 200, statusText: 'OK', headers: {}, config };
    });
    axiosInstance.defaults.adapter = adapter;
    act(() => markRecovering(getSession().epoch));
    const pending = providerA.token();
    const rejected = expect(pending).rejects.toMatchObject({ code: 'ERR_CANCELED' });
    await waitFor(() => expect(adapter).toHaveBeenCalledOnce());
    const tokenB = tokenFor({ ...claims, sub: '2' });
    act(() => replaceAccessToken(tokenB));
    expect(providerA.destroy).toHaveBeenCalledOnce();
    finish();
    await rejected;
    const providerB = mocks.providers[1];
    expect(await providerB.token()).toBe(tokenB);
    expect(providerA.connect).not.toHaveBeenCalled();
  });

  it('does not create a provider while signed out', () => {
    endSession();
    const { result } = renderHook(() => useProvider('documents/doc/branches/main'));
    expect(result.current).toBeNull();
    expect(mocks.providers).toHaveLength(0);
  });
});
