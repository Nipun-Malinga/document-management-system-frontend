import type { Editor } from '@tiptap/react';

const messages = new WeakMap<Editor, string>();
const listeners = new WeakMap<Editor, Set<() => void>>();
export const uploadMessage = (editor: Editor) => messages.get(editor) ?? '';
export const reportUpload = (editor: Editor, message: string) => {
  if (editor.isDestroyed) return;
  messages.set(editor, message);
  listeners.get(editor)?.forEach((listener) => listener());
};
export const subscribeUploads = (editor: Editor, listener: () => void) => {
  const set = listeners.get(editor) ?? new Set<() => void>();
  listeners.set(editor, set);
  set.add(listener);
  return () => { set.delete(listener); };
};
