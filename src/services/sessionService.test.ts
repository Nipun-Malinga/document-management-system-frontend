import { QueryClient } from '@tanstack/react-query';
import { afterEach, expect, it, vi } from 'vitest';
import { axiosInstance } from './apiService';
import { startSessionRuntime } from './sessionService';
import { ACCESS_TOKEN_KEY, endSession, getSession, replaceAccessToken } from '@/states/sessionStore';
import useDocumentInfoPopUp from '@/states/useDocumentInfoPopup';
import useAutoSave from '@/states/useAutoSave';
import { claims, tokenFor } from '@/test/fixtures';

let stop: (() => void) | undefined;
const originalAdapter = axiosInstance.defaults.adapter;
afterEach(() => { stop?.(); stop = undefined; vi.useRealTimers(); axiosInstance.defaults.adapter = originalAdapter; });

it('clears user-specific UI/cache state and responds to cross-tab logout', () => {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokenFor());
  const client = new QueryClient();
  stop = startSessionRuntime(client);
  client.setQueryData(['private'], 'Account A');
  useDocumentInfoPopUp.setState({ documentId: 'private', collapsed: false, shared: true });
  useAutoSave.setState({ states: [{ documentId: 'private', branchId: 'main', saving: true }] });
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.dispatchEvent(new StorageEvent('storage', { key: ACCESS_TOKEN_KEY, newValue: null }));
  expect(getSession().status).toBe('signedOut');
  expect(client.getQueryData(['private'])).toBeUndefined();
  expect(useDocumentInfoPopUp.getState().documentId).toBeNull();
  expect(useDocumentInfoPopUp.getState().collapsed).toBe(true);
  expect(useAutoSave.getState().states).toEqual([]);
  client.clear();
});

it('refreshes before expiry and cancels future refresh timers on logout', async () => {
  vi.useFakeTimers();
  const now = Math.floor(Date.now() / 1000);
  localStorage.setItem(ACCESS_TOKEN_KEY, tokenFor({ ...claims, exp: now + 100 }));
  const adapter = vi.fn(async (config) => ({ data: { token: tokenFor({ ...claims, exp: now + 1000 }) }, status: 200, statusText: 'OK', headers: {}, config }));
  axiosInstance.defaults.adapter = adapter;
  const client = new QueryClient();
  stop = startSessionRuntime(client);
  await vi.advanceTimersByTimeAsync(91000);
  expect(adapter).toHaveBeenCalledOnce();
  expect(getSession().status).toBe('authenticated');
  endSession();
  await vi.advanceTimersByTimeAsync(2000000);
  expect(adapter).toHaveBeenCalledOnce();
  client.clear();
});

it('invalidates a pending query from a prior account so late data never enters account B caches', async () => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  stop = startSessionRuntime(client);
  replaceAccessToken(tokenFor());
  let complete!: (value: string) => void;
  const pending = client.fetchQuery({ queryKey: ['private'], queryFn: () => new Promise<string>((resolve) => { complete = resolve; }) });
  const rejected = expect(pending).rejects.toBeDefined();
  replaceAccessToken(tokenFor({ ...claims, sub: '2' }));
  complete('Account A');
  await rejected;
  expect(client.getQueryData(['private'])).toBeUndefined();
  client.clear();
});

it('keeps the session generation and user caches for same-account cross-tab token renewal', () => {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokenFor());
  const client = new QueryClient();
  stop = startSessionRuntime(client);
  const epoch = getSession().epoch;
  client.setQueryData(['private'], 'Same account');
  const next = tokenFor({ ...claims, exp: claims.exp + 3600 });
  localStorage.setItem(ACCESS_TOKEN_KEY, next);
  window.dispatchEvent(new StorageEvent('storage', { key: ACCESS_TOKEN_KEY, newValue: next }));
  expect(getSession().epoch).toBe(epoch);
  expect(getSession().token).toBe(next);
  expect(client.getQueryData(['private'])).toBe('Same account');
  client.clear();
});
