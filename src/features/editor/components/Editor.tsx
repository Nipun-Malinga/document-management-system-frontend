import {
  EditorContent,
  EditorContext,
  useEditor,
  type Content,
  type UseEditorOptions,
} from '@tiptap/react';
import { useMemo } from 'react';
import Toolbar from './Toolbar';
import TopToolBar from './TopToolBar';

interface Props {
  enableAutoSaver: boolean;
  content: Content;
  documentId: string;
  branchId: string;
  configs: UseEditorOptions;
}

const MainEditor = ({
  enableAutoSaver,
  content,
  documentId,
  branchId,
  configs,
}: Props) => {
  const editor = useEditor({
    ...configs,
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
