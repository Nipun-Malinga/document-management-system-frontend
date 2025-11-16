import '../styles/styles.scss';

import { Editor, EditorContent, EditorContext } from '@tiptap/react';
import { useMemo, type ReactNode } from 'react';
import TopToolBar from './TopToolBar';
import { useDocument } from '@/hooks/document';

interface Props {
  enableAutoSaver: boolean;
  editor: Editor;
  documentId: string;
  branchId: string;
  children: ReactNode;
}

const CoreEditor = ({
  enableAutoSaver,
  editor,
  documentId,
  branchId,
  children,
}: Props) => {
  const providerValue = useMemo(() => ({ editor }), [editor]);
  const { data } = useDocument(documentId);

  return (
    <EditorContext.Provider value={providerValue}>
      <TopToolBar
        documentTitle={data?.title ?? 'Unknown'}
        enableAutoSaver={enableAutoSaver}
        editor={editor}
        documentId={documentId}
        branchId={branchId}
      />
      {children}
      <EditorContent editor={editor} />
    </EditorContext.Provider>
  );
};

export default CoreEditor;
