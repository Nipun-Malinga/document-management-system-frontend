import TextAlign from '@tiptap/extension-text-align';
import type { AnyExtension, UseEditorOptions } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Dropcursor } from '@tiptap/extensions';

export const editorExtensions = (collaborative = false): AnyExtension[] => {
  const baseExtensions: AnyExtension[] = [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3, 4, 5, 6],
      },
      undoRedo: collaborative ? false : undefined,
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
      defaultAlignment: 'left',
    }),
    Image.configure({
      resize: {
        enabled: true,
        alwaysPreserveAspectRatio: true,
      },
    }),
    Dropcursor,
  ];

  return baseExtensions;
};

export const commonEditorConfigs: UseEditorOptions = {
  editorProps: {
    attributes: {
      class: 'outline-none',
    },
  },
};
