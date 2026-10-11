import { StrictMode } from 'react';
import { act, render, screen } from '@testing-library/react';
import type { IMessage } from '@stomp/stompjs';
import { expect, it, vi } from 'vitest';
import CollaboratorCard from '@/features/documents/components/collaborators/CollaboratorCard';

const mocks = vi.hoisted(() => ({ listeners: new Map<string, (message: IMessage) => void>(), cleanups: [] as (() => void)[] }));
vi.mock('@/services/websocketService', () => ({ default: {
  getInstance: () => ({ subscribe: (destination: string, callback: (message: IMessage) => void) => {
    mocks.listeners.set(destination, callback);
    const cleanup = vi.fn(() => { mocks.listeners.delete(destination); });
    mocks.cleanups.push(cleanup);
    return cleanup;
  } }),
} }));

it('returns both cleanups across StrictMode remounts, collaborator changes and unmount', () => {
  const collaborator = { userId: 1, username: 'First', email: 'first@example.com', permission: 'READ_ONLY' as const };
  const { rerender, unmount } = render(<StrictMode><CollaboratorCard collaborator={collaborator} /></StrictMode>);
  expect(mocks.listeners.size).toBe(2);
  expect(mocks.cleanups[0]).toHaveBeenCalledOnce();
  expect(mocks.cleanups[1]).toHaveBeenCalledOnce();
  act(() => mocks.listeners.get('/user/1/status')!({ body: 'true' } as IMessage));
  expect(screen.getByText('online')).toBeVisible();
  rerender(<StrictMode><CollaboratorCard collaborator={{ ...collaborator, userId: 2, username: 'Second' }} /></StrictMode>);
  expect(screen.getByText('offline')).toBeVisible();
  expect([...mocks.listeners.keys()]).toEqual(['/user/2/status', '/app/user/2/status']);
  unmount();
  expect(mocks.listeners.size).toBe(0);
  for (const cleanup of mocks.cleanups) expect(cleanup).toHaveBeenCalledOnce();
});
