import {
  EditorContent,
  EditorContext,
  useEditor,
  type Content,
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useMemo } from 'react';
import Toolbar from './Toolbar';
import TextAlign from '@tiptap/extension-text-align';

interface Props {
  content: Content;
}

const MainEditor = ({ content }: Props) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        defaultAlignment: 'left',
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class: 'outline-none',
      },
    },
  });

  const providerValue = useMemo(() => ({ editor }), [editor]);

  return (
    <EditorContext.Provider value={providerValue}>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </EditorContext.Provider>
  );
};

export default MainEditor;
