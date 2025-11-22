import Collaboration from '@tiptap/extension-collaboration';
import { useEditor } from '@tiptap/react';
import { useEffect, useMemo } from 'react';
// import { IndexeddbPersistence } from 'y-indexeddb';
import * as Y from 'yjs';
import {
  commonEditorConfigs,
  editorExtensions,
} from '../configs/EditorConfigs';
import CoreEditor from './CoreEditor';
import Toolbar from './Toolbar';
import { useProvider } from '@/hooks/document/collaboration';

interface Props {
  documentId: string;
  branchId: string;
  editable: boolean;
}

const CollaborativeEditor = ({ documentId, branchId, editable }: Props) => {
  const ydoc = useMemo(() => new Y.Doc(), []);

  // Unique key to identify the document
  const documentKey: string = `documents/${documentId}/branches/${branchId}`;

  // For offline support
  // new IndexeddbPersistence(documentKey, ydoc);

  const provider = useProvider(documentKey, ydoc);

  const editor = useEditor({
    extensions: [
      ...editorExtensions(true),
      Collaboration.configure({
        document: ydoc,
      }),
    ],
    editable: editable,
    ...commonEditorConfigs,
    content: 'Hello'
  });

  useEffect(() => {
    return () => {
      provider.destroy();
      editor.destroy();
    };
  }, [editor]);

  return (
    <CoreEditor
      enableAutoSaver={false}
      editor={editor}
      documentId={documentId}
      branchId={branchId}
    >
      <Toolbar
        editor={editor}
        canRedo={false}
        canUndo={false}
        disabled={!editable}
      />
    </CoreEditor>
  );
};

export default CollaborativeEditor;
