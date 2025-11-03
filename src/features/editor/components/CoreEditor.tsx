import { Editor, EditorContent, EditorContext } from '@tiptap/react';
import { useMemo } from 'react';
import Toolbar from './Toolbar';
import TopToolBar from './TopToolBar';

interface Props {
  enableAutoSaver: boolean;
  editor: Editor;
  documentId: string;
  branchId: string;
}

const CoreEditor = ({
  enableAutoSaver,
  editor,
  documentId,
  branchId,
}: Props) => {
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

export default CoreEditor;
