import '../styles/styles.scss'

import { Editor, EditorContent, EditorContext } from '@tiptap/react';
import { useMemo, type ReactNode } from 'react';
import TopToolBar from './TopToolBar';

interface Props {
  enableAutoSaver: boolean;
  editor: Editor;
  documentId: string;
  branchId: string;
  toolbar: ReactNode;
}

const CoreEditor = ({
  enableAutoSaver,
  editor,
  documentId,
  branchId,
  toolbar : Toolbar,
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
      {Toolbar}
      <EditorContent editor={editor} />
    </EditorContext.Provider>
  );
};

export default CoreEditor;
