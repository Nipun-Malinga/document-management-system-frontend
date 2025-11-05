import Image from '@tiptap/extension-image';
import { TaskItem, TaskList } from '@tiptap/extension-list';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyleKit } from '@tiptap/extension-text-style';
import type { AnyExtension, UseEditorOptions } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export const editorExtensions = (collaborative = false): AnyExtension[] => {
  const baseExtensions: AnyExtension[] = [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3, 4, 5, 6],
      },
      undoRedo: collaborative ? false : undefined,
    }),
    TextStyleKit,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
      defaultAlignment: 'left',
    }),
    TaskList,
    TaskItem.configure({
      nested: true,
    }),
    Image.configure({
      resize: {
        enabled: true,
        alwaysPreserveAspectRatio: true,
      },
    }),
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
