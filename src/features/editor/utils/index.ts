import { Editor } from 'slate';
import type { customActions, customEditor, customElement } from '../types';

export const isMarkActive = (editor: customEditor, format: customActions) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

export const toggleMark = (editor: customEditor, format: customActions) => {
  isMarkActive(editor, format)
    ? editor.removeMark(format)
    : editor.addMark(format, true);
};

export const parseData = (data: string): customElement[] => {
  try {
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

export const toggleKeyboardEvents = (
  editor: customEditor,
  event: React.KeyboardEvent<HTMLDivElement>
) => {
  const key = event.key.toLowerCase();

  if (key === 'b' && event.ctrlKey) toggleMark(editor, 'bold');
  if (key === 'i' && event.ctrlKey) toggleMark(editor, 'italic');
  if (key === 'u' && event.ctrlKey) toggleMark(editor, 'underline');
};
