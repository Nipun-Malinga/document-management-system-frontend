import TextAlign from '@tiptap/extension-text-align';
import type { AnyExtension, UseEditorOptions } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export const editorExtensions: AnyExtension[] = [
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3, 4, 5, 6],
    },
  }),
  TextAlign.configure({
    types: ['heading', 'paragraph'],
    defaultAlignment: 'left',
  }),
];

export const commonEditorConfigs: UseEditorOptions = {
  editorProps: {
    attributes: {
      class: 'outline-none',
    },
  },
};
