import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { ReactNode } from 'react';
import { AxiosError, type AxiosAdapter } from 'axios';
import { axiosInstance } from '@/services/apiService';
import { replaceAccessToken } from '@/states/sessionStore';
import { tokenFor, document } from '@/test/fixtures';
import { pageOf } from '@/test/pages';
import { normalizePageParams } from '@/utils/collectionUtils';
import useUserDocuments from './document/useUserDocuments';
import useUserSharedDocuments from './document/useUserSharedDocuments';
import useBranches from './document/useBranches';
import useDocumentVersions from './document/useDocumentVersions';
import useTrashedDocuments from './document/useTrashedDocuments';
import useTrashedBranches from './document/useTrashedBranches';
import useCollaborators from './document/collaboration/useCollaborators';
import useGetTemplates from './templates/useGetTemplates';

let client: QueryClient;
const adapter = axiosInstance.defaults.adapter;
const wrapper = ({ children }: { children: ReactNode }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>;
beforeEach(() => {
  replaceAccessToken(tokenFor());
  client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
});
afterEach(() => { client.clear(); axiosInstance.defaults.adapter = adapter; });

const endpoints = [
  ['/documents', () => useUserDocuments({ page: 1, size: 20, status: 'PRIVATE', favorite: false, title: ' Plan ' })],
  ['/documents/share', () => useUserSharedDocuments({ page: 1, size: 20, permission: 'READ_ONLY' })],
  ['/documents/doc/branches', () => useBranches('doc', { page: 1, size: 20, branchName: 'draft' })],
  ['/documents/doc/versions', () => useDocumentVersions('doc', { page: 1, size: 20, branchId: 'branch', sort: 'createdAt,desc' })],
  ['/documents/trash', () => useTrashedDocuments({ page: 1, size: 20, title: 'Gone' })],
  ['/documents/trash/branches', () => useTrashedBranches({ page: 1, size: 20, documentId: 'doc' })],
  ['/documents/doc/share/users', () => useCollaborators('doc', { page: 1, size: 20, email: 'reader@example.com' })],
  ['/documents/templates', () => useGetTemplates({ page: 1, size: 20, title: 'Notes' })],
] as const;

describe('paginated collection contracts', () => {
  it.each(endpoints)('requests a single later page and isolates the key for %s', async (endpoint, useCollection) => {
    const requests: Parameters<AxiosAdapter>[0][] = [];
    axiosInstance.defaults.adapter = async (config) => {
      requests.push(config);
      return { config, data: pageOf([{ id: 'later', added_date: '2026-10-10 12:00:00', createdAt: '2026-10-09 10:00:00' }], 1, 21), status: 200, statusText: 'OK', headers: {} };
    };
    const { result } = renderHook(() => useCollection(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(requests).toHaveLength(1);
    expect(requests[0].url).toBe(endpoint);
    expect(requests[0].params).toMatchObject({ page: 1, size: 20 });
    expect(requests[0].signal).toBeDefined();
    expect(result.current.data).toMatchObject({ page: 1, totalElements: 21, hasPrevious: true, hasNext: false, content: [{ id: 'later' }] });
    const key = client.getQueryCache().getAll()[0].queryKey;
    expect(key.at(-1)).toEqual(requests[0].params);
    if (endpoint === '/documents') expect(requests[0].params).toMatchObject({ favorite: false, title: 'Plan', status: 'PRIVATE' });
    if (endpoint.includes('/versions')) expect(result.current.data?.content[0]).toMatchObject({ createdAt: '2026-10-09 10:00:00' });
    if (endpoint === '/documents/trash/branches') {
      expect(result.current.data?.content[0]).toMatchObject({ addedDate: '2026-10-10 12:00:00' });
      expect(result.current.data?.content[0]).not.toHaveProperty('added_date');
    }
  });

  it('keeps pages, sort, filters, and favorites in separate caches and invalidates the prefix', async () => {
    axiosInstance.defaults.adapter = async (config) => ({ config, data: pageOf([{ ...document, title: JSON.stringify(config.params) }]), status: 200, statusText: 'OK', headers: {} });
    const { result } = renderHook(() => [
      useUserDocuments(), useUserDocuments({ page: 1 }), useUserDocuments({ favorite: true }),
      useUserDocuments({ title: 'Plan' }), useUserDocuments({ sort: 'title,asc' }),
    ], { wrapper });
    await waitFor(() => expect(result.current.every((query) => query.isSuccess)).toBe(true));
    expect(client.getQueryCache().getAll()).toHaveLength(5);
    expect(new Set(result.current.map((query) => query.data?.content[0].title)).size).toBe(5);
    await act(async () => { await client.invalidateQueries({ queryKey: ['documents-own'], refetchType: 'none' }); });
    expect(client.getQueryCache().getAll().every((query) => query.state.isInvalidated)).toBe(true);
  });

  it('normalizes defaults, bounds, blank filters, and false without changing parameter meaning', () => {
    expect(normalizePageParams({})).toEqual({ page: 0, size: 20, sort: 'id,asc' });
    expect(normalizePageParams({ page: -3, size: 300, sort: ' title,asc ', title: ' ', favorite: false })).toEqual({ page: 0, size: 50, sort: 'title,asc', favorite: false });
    expect(normalizePageParams({ page: 1.9, size: 0 })).toMatchObject({ page: 1, size: 1 });
  });

  it('disables requests without a document scope and never reuses another document page', async () => {
    const requests: string[] = [];
    axiosInstance.defaults.adapter = async (config) => {
      requests.push(config.url!);
      return { config, data: pageOf([{ id: config.url }]), status: 200, statusText: 'OK', headers: {} };
    };
    const { result, rerender } = renderHook(({ id }) => useBranches(id), { initialProps: { id: '' }, wrapper });
    expect(requests).toHaveLength(0);
    rerender({ id: 'a' });
    await waitFor(() => expect(result.current.data?.content[0].id).toBe('/documents/a/branches'));
    rerender({ id: 'b' });
    expect(result.current.data).toBeUndefined();
    await waitFor(() => expect(result.current.data?.content[0].id).toBe('/documents/b/branches'));
    expect(requests).toEqual(['/documents/a/branches', '/documents/b/branches']);
  });

  it.each([[], { data: [] }, { content: [] }])('rejects an obsolete or malformed response rather than reporting empty success', async (data) => {
    axiosInstance.defaults.adapter = async (config) => ({ config, data, status: 200, statusText: 'OK', headers: {} });
    const { result } = renderHook(() => useGetTemplates(), { wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toContain('invalid collection');
  });

  it('keeps a typed ProblemDetail rejection as an error', async () => {
    axiosInstance.defaults.adapter = async (config) => { throw new AxiosError('Forbidden', undefined, config, undefined, { config, data: { status: 403, title: 'Forbidden', detail: 'Access denied' }, status: 403, statusText: 'Forbidden', headers: {} }); };
    const { result } = renderHook(() => useCollaborators('doc'), { wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toMatchObject({ response: { data: { detail: 'Access denied' } } });
  });
});
