import { Editor } from 'slate';
import type { markKeys, customEditor, customElement } from '../types';

export const isMarkActive = (editor: customEditor, format: markKeys) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

export const toggleMark = (editor: customEditor, format: markKeys) => {
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
