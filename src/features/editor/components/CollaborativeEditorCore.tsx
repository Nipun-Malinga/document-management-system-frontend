import Collaboration from '@tiptap/extension-collaboration';
import { useEditor } from '@tiptap/react';
import { useEffect, useMemo } from 'react';
import { IndexeddbPersistence } from 'y-indexeddb';
import * as Y from 'yjs';
import { useProvider } from '../../../hooks/collaboration/useProvider';
import {
  commonEditorConfigs,
  editorExtensions,
} from '../configs/EditorConfigs';
import CoreEditor from './CoreEditor';
import Toolbar from './Toolbar';

interface Props {
  documentId: string;
  branchId: string;
}

const CollaborativeEditor = ({ documentId, branchId }: Props) => {
  const ydoc = useMemo(() => new Y.Doc(), []);

  // Unique key to identify the document
  const documentKey: string = `${documentId}:${branchId}`;

  // For offline support
  new IndexeddbPersistence(documentKey, ydoc);

  const provider = useProvider(documentKey, ydoc);

  const editor = useEditor({
    extensions: [
      ...editorExtensions(true),
      Collaboration.configure({
        document: ydoc,
      }),
    ],
    ...commonEditorConfigs,
  });

  useEffect(() => {
    return () => {
      provider.destroy();
      editor?.destroy();
    };
  }, [editor]);

  return (
    <CoreEditor
      enableAutoSaver={false}
      editor={editor}
      documentId={documentId}
      branchId={branchId}
      toolbar={<Toolbar editor={editor} canRedo={false} canUndo={false} />}
    />
  );
};

export default CollaborativeEditor;
