import TextAlign from '@tiptap/extension-text-align';
import {
  EditorContent,
  EditorContext,
  useEditor,
  type Content,
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useMemo } from 'react';
import Toolbar from './Toolbar';
import TopToolBar from './TopToolBar';

interface Props {
  enableAutoSaver: boolean;
  content: Content;
  documentId: string;
  branchId: string;
}

const MainEditor = ({
  enableAutoSaver,
  content,
  documentId,
  branchId,
}: Props) => {
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
      <TopToolBar
        enableAutoSaver={enableAutoSaver}
        editor={editor}
        documentId={documentId}
        branchId={branchId}
      />
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </EditorContext.Provider>
  );
};

export default MainEditor;
