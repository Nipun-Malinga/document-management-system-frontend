import FileHandler from '@tiptap/extension-file-handler';
import Image from '@tiptap/extension-image';
import { TaskItem, TaskList } from '@tiptap/extension-list';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyleKit } from '@tiptap/extension-text-style';
import type { AnyExtension, UseEditorOptions } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { imageUploadHandler } from '../handlers/imageUploadHandler';

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
    FileHandler.configure({
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],

      onDrop: async (currentEditor, files, pos) => {
        for (const file of files) {
          try {
            const imageUrl = await imageUploadHandler(file);
            currentEditor
              .chain()
              .insertContentAt(pos, {
                type: 'image',
                attrs: { src: imageUrl },
              })
              .focus()
              .run();
          } catch (err) {
            console.error('Image upload failed:', err);
          }
        }
      },

      onPaste: async (currentEditor, files, htmlContent) => {
        if (htmlContent) {
          console.log(htmlContent);
          return false;
        }

        for (const file of files) {
          try {
            const imageUrl = await imageUploadHandler(file);
            currentEditor
              .chain()
              .insertContentAt(currentEditor.state.selection.anchor, {
                type: 'image',
                attrs: { src: imageUrl },
              })
              .focus()
              .run();
          } catch (err) {
            console.error('Image upload failed:', err);
          }
        }
      },
    }),
  ];

  return baseExtensions;
};

export const commonEditorConfigs: UseEditorOptions = {
  editorProps: {
    attributes: {
      class: 'outline-none w-full h-[85vh] p-2',
    },
  },
};
