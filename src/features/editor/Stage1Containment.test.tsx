import { initializeSession } from '@/states/sessionStore';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import APIService from '@/services/apiService';
import { document, permission, tokenFor } from '@/test/fixtures';
import type { Permission } from '@/models/Permission';
import DocumentCard from '@/features/documents/components/DocumentCard';
import InfoButtons from '@/features/documents/components/info/InfoButtons';
import BranchCard from './components/info/branches/BranchCard';
import BranchCreateForm from './components/info/branches/BranchCreateForm';
import VersionCard from './components/info/versions/VersionCard';
import VersionCreateForm from './components/info/versions/VersionCreateForm';

// Isolate containment from the existing Alert wrapper's nested-button markup.
vi.mock('@/components/common/Alert', () => ({
  default: ({ trigger }: { trigger: ReactNode }) => <>{trigger}</>,
}));

let client: QueryClient;
const branch = { id: 'other', documentId: 'doc', branchName: 'other', createdAt: '', updatedAt: '', trashed: false };
const version = {
  id: 'version', branchId: 'other', documentId: 'doc', title: 'Snapshot', status: 'PRIVATE' as const,
  createdAt: '2026-10-10', createdBy: { id: 1, username: 'owner', firstname: 'First', lastname: 'Last', email: 'owner@example.com', role: 'USER' as const },
};

beforeEach(() => {
  localStorage.setItem('jwt-access-token', tokenFor()); initializeSession();
  client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  vi.spyOn(APIService.prototype, 'post').mockResolvedValue({});
  vi.spyOn(APIService.prototype, 'put').mockResolvedValue({});
  vi.spyOn(APIService.prototype, 'delete').mockResolvedValue({});
});
afterEach(() => { client.clear(); vi.restoreAllMocks(); });

const renderControls = (value: Permission['permission'], ownerId = 2, shared = false) => {
  const doc = { ...document, ownerId, shared };
  client.setQueryData(['document', 'doc'], doc);
  client.setQueryData(['permissions', 'doc', 'main'], { ...permission, permission: value });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={['/document/doc/branch/main/edit']}>
        <Routes><Route path='/document/:documentId/branch/:branchId/edit' element={<>
          <DocumentCard document={doc} />
          <InfoButtons documentId='doc' />
          <BranchCreateForm />
          <VersionCreateForm />
          <BranchCard branch={branch} />
          <VersionCard version={version} />
        </>} /></Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

const expectNoWrites = () => {
  expect(APIService.prototype.post).not.toHaveBeenCalled();
  expect(APIService.prototype.put).not.toHaveBeenCalled();
  expect(APIService.prototype.delete).not.toHaveBeenCalled();
};

describe('Stage 1 action containment', () => {
  it.each(['READ_ONLY', 'UNAUTHORIZED'] as const)('hides mutation controls for %s and sends no writes', (value) => {
    renderControls(value);
    expect(screen.queryByRole('button', { name: 'Toggle bookmark' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Create Branch' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Create Version' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Merge' })).not.toBeInTheDocument();
    expectNoWrites();
  });

  it('allows writers to create/merge but keeps owner-only actions hidden', () => {
    renderControls('READ_WRITE');
    expect(screen.getByText('Created 2026-10-10')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create Branch' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create Version' })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Merge' })).toHaveLength(2);
    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Toggle bookmark' })).not.toBeInTheDocument();
    expectNoWrites();
  });

  it('keeps collaborative snapshots and merges disabled', () => {
    renderControls('ADMIN', 1, true);
    expect(screen.getByRole('button', { name: 'Create Branch' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Create Version' })).toBeDisabled();
    for (const button of screen.getAllByRole('button', { name: 'Merge' })) expect(button).toBeDisabled();
    expectNoWrites();
  });

  it('removes write controls when permissions change', async () => {
    renderControls('READ_WRITE');
    act(() => { client.setQueryData(['permissions', 'doc', 'main'], { ...permission, permission: 'READ_ONLY' }); });
    await waitFor(() => expect(screen.queryByRole('button', { name: 'Create Branch' })).not.toBeInTheDocument());
    expect(screen.queryByRole('button', { name: 'Create Version' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Merge' })).not.toBeInTheDocument();
    expectNoWrites();
  });

  it('preserves the owner favorite action without presence requests', async () => {
    const get = vi.spyOn(APIService.prototype, 'get');
    renderControls('ADMIN', 1);
    fireEvent.click(screen.getByRole('button', { name: 'Toggle bookmark' }));
    await waitFor(() => expect(APIService.prototype.post).toHaveBeenCalledTimes(1));
    expect(get).not.toHaveBeenCalled();
    // Only document and branch Delete remain; versions have no Delete action.
    expect(screen.getAllByRole('button', { name: 'Delete' })).toHaveLength(2);
  });
});
