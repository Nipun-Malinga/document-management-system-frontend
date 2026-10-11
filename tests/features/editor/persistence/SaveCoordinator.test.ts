import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getSession, replaceAccessToken, endSession } from '@/states/sessionStore';
import { tokenFor } from '../../../fixtures';
import { SaveCoordinator } from '@/features/editor/persistence/SaveCoordinator';

const deferred = <T,>() => {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((done, fail) => { resolve = done; reject = fail; });
  return { promise, resolve, reject };
};
beforeEach(() => replaceAccessToken(tokenFor()));
const setup = (save = vi.fn<(content: string) => Promise<void>>(async () => {})) => {
  const apply = vi.fn();
  const lock = vi.fn();
  let writable = true;
  const coordinator = new SaveCoordinator({ epoch: getSession().epoch, content: 'original', save, apply, lock, canWrite: () => writable });
  return { coordinator, save, apply, lock, deny: () => { writable = false; } };
};

describe('solo revision save coordinator', () => {
  it('does not write clean content and shares one flush across overlapping callers', async () => {
    const gate = deferred<void>();
    const { coordinator, save } = setup(vi.fn(() => gate.promise));
    await coordinator.flush();
    expect(save).not.toHaveBeenCalled();
    coordinator.markDirty('first');
    const first = coordinator.flush();
    const second = coordinator.flush();
    expect(second).toBe(first);
    await vi.waitFor(() => expect(save).toHaveBeenCalledOnce());
    gate.resolve();
    await first;
    expect(coordinator.getSnapshot()).toMatchObject({ revision: 1, savedRevision: 1, status: 'saved' });
    await coordinator.flush();
    expect(save).toHaveBeenCalledOnce();
  });

  it('serializes edits made in flight and acknowledges only the payload actually sent', async () => {
    const first = deferred<void>();
    const second = deferred<void>();
    const save = vi.fn().mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
    const { coordinator } = setup(save);
    coordinator.markDirty('first');
    const flush = coordinator.flush();
    await vi.waitFor(() => expect(save).toHaveBeenCalledWith('first'));
    coordinator.markDirty('second');
    expect(save).toHaveBeenCalledOnce();
    first.resolve();
    await vi.waitFor(() => expect(save).toHaveBeenCalledWith('second'));
    expect(coordinator.getSnapshot()).toMatchObject({ revision: 2, savedRevision: 1, status: 'saving' });
    second.resolve();
    await flush;
    expect(coordinator.getSnapshot()).toMatchObject({ revision: 2, savedRevision: 2, status: 'saved' });
  });

  it('retains failed revisions and saves the latest content on explicit retry', async () => {
    const save = vi.fn().mockRejectedValueOnce(new Error('Offline')).mockResolvedValueOnce(undefined);
    const { coordinator } = setup(save);
    coordinator.markDirty('first');
    await expect(coordinator.flush()).rejects.toThrow('Offline');
    expect(coordinator.getSnapshot()).toMatchObject({ revision: 1, savedRevision: 0, status: 'error' });
    expect(coordinator.needsProtection).toBe(true);
    coordinator.markDirty('latest');
    await coordinator.flush();
    expect(save).toHaveBeenLastCalledWith('latest');
    expect(coordinator.dirty).toBe(false);
  });

  it('blocks snapshots on failed save and freezes content until the entire snapshot completes', async () => {
    const { coordinator, save, lock } = setup(vi.fn().mockRejectedValueOnce(new Error('Offline')).mockResolvedValue(undefined));
    coordinator.markDirty('draft');
    const create = vi.fn(async () => {});
    await expect(coordinator.exclusive(async () => { await coordinator.flush(); await create(); })).rejects.toThrow('Offline');
    expect(create).not.toHaveBeenCalled();
    const snapshot = deferred<void>();
    const run = coordinator.exclusive(async () => { await coordinator.flush(); await snapshot.promise; });
    await vi.waitFor(() => expect(save).toHaveBeenCalledTimes(2));
    coordinator.markDirty('must not enter locked document');
    expect(coordinator.getSnapshot().revision).toBe(1);
    await expect(coordinator.exclusive(create)).rejects.toThrow('in progress');
    expect(lock).toHaveBeenLastCalledWith(true);
    snapshot.resolve();
    await run;
    expect(lock).toHaveBeenLastCalledWith(false);
  });

  it('drains an existing write before a transition can finish', async () => {
    const gate = deferred<void>();
    const { coordinator } = setup(vi.fn(() => gate.promise));
    coordinator.markDirty('draft');
    const saving = coordinator.flush();
    let left = false;
    const leaving = coordinator.prepareToLeave().then(() => { left = true; });
    await Promise.resolve();
    expect(left).toBe(false);
    gate.resolve();
    await Promise.all([saving, leaving]);
    expect(left).toBe(true);
  });

  it('preserves local content on a failed merge and never reloads it as success', async () => {
    const { coordinator, apply, lock } = setup();
    coordinator.markDirty('draft');
    const load = vi.fn(async () => 'remote');
    await expect(coordinator.replace(async () => { throw new Error('Rejected merge'); }, load)).rejects.toThrow('Rejected merge');
    expect(load).not.toHaveBeenCalled();
    expect(apply).not.toHaveBeenCalled();
    expect(coordinator.getSnapshot().replacementPending).toBe(false);
    expect(lock).toHaveBeenLastCalledWith(false);
  });

  it('reloads successful replacements explicitly without re-saving old content', async () => {
    const { coordinator, save, apply, lock } = setup();
    coordinator.markDirty('draft');
    const merge = vi.fn(async () => {});
    const load = vi.fn().mockRejectedValueOnce(new Error('Read failed')).mockResolvedValueOnce('remote');
    await expect(coordinator.replace(merge, load)).rejects.toThrow('Read failed');
    expect(coordinator.getSnapshot()).toMatchObject({ locked: true, replacementPending: true, status: 'error' });
    expect(apply).not.toHaveBeenCalled();
    await expect(coordinator.flush()).rejects.toThrow('Reload');
    await coordinator.retryReplacement();
    expect(merge).toHaveBeenCalledOnce();
    expect(save).toHaveBeenCalledOnce();
    expect(apply).toHaveBeenCalledWith('remote');
    expect(lock).toHaveBeenLastCalledWith(false);
    expect(coordinator.getSnapshot()).toMatchObject({ locked: false, replacementPending: false, status: 'saved' });
  });

  it('fails closed for permission loss, closed editors, and logout races', async () => {
    const { coordinator, deny, save } = setup();
    coordinator.markDirty('draft');
    deny();
    await expect(coordinator.flush()).rejects.toThrow('permission');
    expect(save).not.toHaveBeenCalled();
    coordinator.dispose();
    await expect(coordinator.flush()).rejects.toThrow('closed');
    const gate = deferred<void>();
    const pending = setup(vi.fn(() => gate.promise));
    pending.coordinator.markDirty('draft');
    const flush = pending.coordinator.flush();
    await vi.waitFor(() => expect(pending.save).toHaveBeenCalledOnce());
    endSession();
    gate.resolve();
    await expect(flush).rejects.toThrow('Session changed');
    expect(pending.coordinator.getSnapshot().savedRevision).toBe(0);
  });
});
