import TextAlign from '@tiptap/extension-text-align';
import type { UseEditorOptions } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export const baseEditorConfigs: UseEditorOptions = {
  extensions: [
    StarterKit,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
      defaultAlignment: 'left',
    }),
  ],
};

export const collaborativeEditorConfigs: UseEditorOptions = {
  extensions: [
    StarterKit.configure({ undoRedo: false }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
      defaultAlignment: 'left',
    }),
  ],
};
