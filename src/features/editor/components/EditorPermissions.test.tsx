import { initializeSession } from '@/states/sessionStore';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { Editor, EditorContent } from '@tiptap/react';
import { Extension } from '@tiptap/core';
import type { HocuspocusProvider } from '@hocuspocus/provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Doc } from 'yjs';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import APIService from '@/services/apiService';
import { tokenFor } from '@/test/fixtures';
import SoloEditorCore from './SoloEditorCore';
import CollaborativeEditorCore from './CollaborativeEditorCore';
import AutoSaver from './AutoSaver';

const state = vi.hoisted(() => ({
  editor: null as Editor | null,
  provider: null as HocuspocusProvider | null,
}));

vi.mock('./CoreEditor', () => ({
  default: ({ editor, enableAutoSaver, children }: { editor: Editor; enableAutoSaver: boolean; children: ReactNode }) => {
    state.editor = editor;
    return <div data-testid='core' data-autosave={enableAutoSaver}><EditorContent editor={editor} />{children}</div>;
  },
}));
vi.mock('./Toolbar', () => ({ default: ({ disabled }: { disabled: boolean }) => <button disabled={disabled}>Format</button> }));
vi.mock('@/hooks/document/collaboration', () => ({ useProvider: () => state.provider }));
vi.mock('@tiptap/extension-collaboration-caret', () => ({
  CollaborationCaret: { configure: () => Extension.create({ name: 'testCaret' }) },
}));

beforeEach(() => { localStorage.setItem('jwt-access-token', tokenFor()); initializeSession(); });
afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); state.editor = null; state.provider = null; });

describe('editor permission changes', () => {
  it('updates solo editability and autosave without recreating content', () => {
    const props = { documentId: 'doc', branchId: 'main', content: '<p>Preserved text</p>' };
    const { rerender } = render(<SoloEditorCore {...props} editable />);
    const editor = state.editor!;
    expect(editor.isEditable).toBe(true);
    expect(screen.getByTestId('core')).toHaveAttribute('data-autosave', 'true');
    rerender(<SoloEditorCore {...props} editable={false} />);
    expect(state.editor).toBe(editor);
    expect(editor.isEditable).toBe(false);
    expect(editor.getText()).toBe('Preserved text');
    expect(screen.getByRole('button', { name: 'Format' })).toBeDisabled();
    expect(screen.getByTestId('core')).toHaveAttribute('data-autosave', 'false');
    rerender(<SoloEditorCore {...props} editable />);
    expect(editor.isEditable).toBe(true);
  });

  it('updates collaborative editability with the same Y.Doc and no REST autosave', () => {
    const ydoc = new Doc();
    state.provider = { document: ydoc, on: vi.fn(), off: vi.fn() } as unknown as HocuspocusProvider;
    const props = { documentId: 'doc', branchId: 'main' };
    const { rerender, unmount } = render(<CollaborativeEditorCore {...props} editable />);
    const editor = state.editor!;
    expect(editor.isEditable).toBe(true);
    rerender(<CollaborativeEditorCore {...props} editable={false} />);
    expect(state.editor).toBe(editor);
    expect(editor.isEditable).toBe(false);
    expect(screen.getByRole('button', { name: 'Format' })).toBeDisabled();
    expect(screen.getByTestId('core')).toHaveAttribute('data-autosave', 'false');
    rerender(<CollaborativeEditorCore {...props} editable />);
    expect(editor.isEditable).toBe(true);
    expect(screen.getByTestId('core')).toHaveAttribute('data-autosave', 'false');
    unmount();
    ydoc.destroy();
  });

  it('pauses edits after collaboration authentication fails and retries with the same document', () => {
    const ydoc = new Doc();
    const on = vi.fn<(event: string, callback: () => void) => void>();
    const off = vi.fn();
    const connect = vi.fn(async () => {});
    const socket = { shouldConnect: false };
    state.provider = { document: ydoc, on, off, connect, configuration: { websocketProvider: socket } } as unknown as HocuspocusProvider;
    const { unmount } = render(<CollaborativeEditorCore documentId='doc' branchId='main' editable />);
    const editor = state.editor!;
    const failed = on.mock.calls.find(([event]) => event === 'authenticationFailed')![1];
    const authenticated = on.mock.calls.find(([event]) => event === 'authenticated')![1];
    act(() => failed());
    expect(editor.isEditable).toBe(false);
    expect(screen.getByRole('alert')).toHaveTextContent('Editing is paused');
    fireEvent.click(screen.getByRole('button', { name: 'Retry connection' }));
    expect(socket.shouldConnect).toBe(true);
    expect(connect).toHaveBeenCalledOnce();
    act(() => authenticated());
    expect(editor.isEditable).toBe(true);
    expect(state.editor).toBe(editor);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    unmount();
    expect(off).toHaveBeenCalledWith('authenticationFailed', failed);
    expect(off).toHaveBeenCalledWith('authenticated', authenticated);
    ydoc.destroy();
  });

  it('skips the 30-second REST write if the mounted editor loses write access', async () => {
    vi.useFakeTimers();
    const put = vi.spyOn(APIService.prototype, 'put').mockResolvedValue({});
    const client = new QueryClient();
    const { Editor: TiptapEditor } = await import('@tiptap/react');
    const { default: StarterKit } = await import('@tiptap/starter-kit');
    const editor = new TiptapEditor({ extensions: [StarterKit], content: '<p>Text</p>' });
    const { unmount } = render(<QueryClientProvider client={client}><AutoSaver editor={editor} documentId='doc' branchId='main' /></QueryClientProvider>);
    await act(async () => { await vi.advanceTimersByTimeAsync(30000); });
    expect(put).toHaveBeenCalledTimes(1);
    editor.setEditable(false);
    await act(async () => { await vi.advanceTimersByTimeAsync(30000); });
    expect(put).toHaveBeenCalledTimes(1);
    unmount();
    editor.destroy();
    client.clear();
  });
});
