import { initializeSession } from '@/states/sessionStore';
import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import APIService from '@/services/apiService';
import { document, permission, tokenFor } from '@/test/fixtures';
import useDocumentAccess from './useDocumentAccess';

let client: QueryClient;
const key = ['permissions', 'doc', 'main'];
const wrapper = ({ children }: { children: ReactNode }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>;

beforeEach(() => {
  localStorage.setItem('jwt-access-token', tokenFor()); initializeSession();
  client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  client.setQueryData(['document', 'doc'], document);
});
afterEach(() => { client.clear(); vi.restoreAllMocks(); });

describe('document access', () => {
  it.each([
    ['READ_ONLY', true, false], ['READ_WRITE', true, true],
    ['ADMIN', true, true], ['UNAUTHORIZED', false, false], ['UNKNOWN', false, false],
  ])('handles %s explicitly', (value, canRead, canWrite) => {
    client.setQueryData(key, { ...permission, permission: value });
    const { result } = renderHook(() => useDocumentAccess('doc', 'main'), { wrapper });
    expect(result.current.canRead).toBe(canRead);
    expect(result.current.canWrite).toBe(canWrite);
  });

  it.each([{ userId: 2 }, { documentId: 'other' }, { branchId: 'other' }])('rejects mismatched permission scope %o', (override) => {
    client.setQueryData(key, { ...permission, ...override });
    const { result } = renderHook(() => useDocumentAccess('doc', 'main'), { wrapper });
    expect(result.current.canWrite).toBe(false);
    expect(result.current.canRead).toBe(false);
    expect(result.current.isOwner).toBe(false);
  });

  it('does not infer ownership from write/admin permission', () => {
    client.setQueryData(['document', 'doc'], { ...document, ownerId: 2 });
    client.setQueryData(key, { ...permission, permission: 'ADMIN' });
    const { result } = renderHook(() => useDocumentAccess('doc', 'main'), { wrapper });
    expect(result.current.canWrite).toBe(true);
    expect(result.current.isOwner).toBe(false);
  });

  it('denies writes while loading and after a failed permission request', async () => {
    vi.spyOn(APIService.prototype, 'get').mockRejectedValue(new Error('Unavailable'));
    const { result } = renderHook(() => useDocumentAccess('doc', 'main'), { wrapper });
    expect(result.current.isPending).toBe(true);
    expect(result.current.canWrite).toBe(false);
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.canRead).toBe(false);
    expect(result.current.canWrite).toBe(false);
  });

  it('revokes write access during refetch and rejects stale data after failure', async () => {
    client.setQueryData(key, permission);
    let rejectRequest!: (reason: Error) => void;
    vi.spyOn(APIService.prototype, 'get').mockImplementation(() => new Promise((_, reject) => { rejectRequest = reject; }));
    const { result } = renderHook(() => useDocumentAccess('doc', 'main'), { wrapper });
    expect(result.current.canWrite).toBe(true);
    act(() => { void client.invalidateQueries({ queryKey: key }); });
    await waitFor(() => expect(result.current.canWrite).toBe(false));
    act(() => rejectRequest(new Error('Denied')));
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.canWrite).toBe(false);
    expect(result.current.isOwner).toBe(false);
  });
});
