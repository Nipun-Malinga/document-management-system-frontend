import { assertSession } from '@/states/sessionStore';

export interface SaveState {
  revision: number;
  savedRevision: number;
  status: 'saved' | 'dirty' | 'saving' | 'error';
  error: string;
  locked: boolean;
  replacementPending: boolean;
}

interface Config {
  epoch: number;
  content: string;
  save: (content: string) => Promise<unknown>;
  canWrite: () => boolean;
  apply: (content: string) => string | void;
  lock: (locked: boolean) => void;
}

export class SaveCoordinator {
  private state: SaveState = { revision: 0, savedRevision: 0, status: 'saved', error: '', locked: false, replacementPending: false };
  private content: string;
  private listeners = new Set<() => void>();
  private saving: Promise<void> | null = null;
  private operation: Promise<unknown> | null = null;
  private reload: (() => Promise<string>) | null = null;
  private disposed = false;

  private config: Config;
  constructor(config: Config) { this.config = config; this.content = config.content; }
  getSnapshot = () => this.state;
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; };
  get dirty() { return this.state.revision !== this.state.savedRevision; }
  get needsProtection() { return this.dirty || this.state.locked || Boolean(this.saving); }
  private update(patch: Partial<SaveState>) {
    if (this.disposed) return;
    this.state = { ...this.state, ...patch };
    for (const listener of this.listeners) listener();
  }
  private assertCurrent() {
    assertSession(this.config.epoch);
    if (this.disposed) throw new Error('The originating editor is closed.');
  }
  assertWritable = () => {
    this.assertCurrent();
    if (!this.config.canWrite()) throw new Error('Editing permission is unavailable. Your unsaved content is still in this editor.');
  };
  private lock(locked: boolean) {
    this.config.lock(locked);
    this.update({ locked });
  }
  markDirty = (content: string) => {
    if (this.disposed || this.state.locked || content === this.content) return;
    this.content = content;
    this.update({ revision: this.state.revision + 1, status: this.saving ? 'saving' : 'dirty', error: '' });
  };
  flush = (): Promise<void> => {
    try {
      this.assertCurrent();
      if (this.reload) throw new Error('Reload the merged branch before saving or leaving.');
      if (this.saving) return this.saving;
      if (!this.dirty) return Promise.resolve();
      this.assertWritable();
    } catch (error) { return Promise.reject(error); }
    const run = Promise.resolve().then(async () => {
      while (this.dirty) {
        this.assertWritable();
        const revision = this.state.revision;
        const content = this.content;
        this.update({ status: 'saving', error: '' });
        await this.config.save(content);
        this.assertCurrent();
        // Only this payload was acknowledged; edits made in flight still need a write.
        this.update({ savedRevision: revision, status: this.state.revision === revision ? 'saved' : 'dirty' });
      }
    }).catch((error: unknown) => {
      this.update({ status: 'error', error: error instanceof Error ? error.message : 'Saving failed. Your changes remain unsaved.' });
      throw error;
    }).finally(() => { if (this.saving === run) this.saving = null; });
    this.saving = run;
    return run;
  };
  exclusive = <T,>(action: () => Promise<T>): Promise<T> => {
    try {
      this.assertWritable();
      if (this.state.locked) throw new Error('Another document operation is still in progress.');
    } catch (error) { return Promise.reject(error); }
    this.lock(true);
    const run = Promise.resolve().then(action).finally(() => {
      if (this.operation === run) this.operation = null;
      if (!this.disposed && !this.reload) this.lock(false);
    });
    this.operation = run;
    return run;
  };
  prepareToLeave = async () => {
    this.assertCurrent();
    if (this.operation) await this.operation;
    this.assertCurrent();
    if (this.reload) throw new Error('The merge completed but the branch must be reloaded before leaving.');
    if (!this.dirty && !this.saving) return;
    await this.exclusive(this.flush);
  };
  replace = (mutate: () => Promise<unknown>, load: () => Promise<string>) => this.exclusive(async () => {
    await this.flush();
    this.assertWritable();
    await mutate();
    this.assertCurrent();
    this.reload = load;
    this.update({ replacementPending: true });
    await this.reloadReplacement();
  });
  private reloadReplacement = async () => {
    try {
      this.assertWritable();
      const content = await this.reload!();
      this.assertWritable();
      // Apply only after a successful authoritative read; never save old content over a merge.
      const applied = this.config.apply(content);
      this.content = typeof applied === 'string' ? applied : content;
      this.reload = null;
      const revision = this.state.revision + 1;
      this.update({ revision, savedRevision: revision, status: 'saved', error: '', replacementPending: false });
    } catch (error) {
      this.update({ status: 'error', error: 'The merge completed, but reloading failed. Editing and saving are paused. Retry reload.' });
      throw error;
    }
  };
  retryReplacement = (): Promise<void> => {
    if (this.operation) return Promise.reject(new Error('A document operation is still in progress.'));
    if (!this.reload) return Promise.resolve();
    const run = this.reloadReplacement().finally(() => {
      if (this.operation === run) this.operation = null;
      if (!this.disposed && !this.reload) this.lock(false);
    });
    this.operation = run;
    return run;
  };
  dispose = () => { this.disposed = true; this.listeners.clear(); };
}
