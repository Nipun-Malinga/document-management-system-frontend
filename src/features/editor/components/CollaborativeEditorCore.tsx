import { useEditor } from '@tiptap/react';
import { useEffect, useMemo } from 'react';
import {
  commonEditorConfigs,
  editorExtensions,
} from '../configs/EditorConfigs';
import CoreEditor from './CoreEditor';
import Collaboration from '@tiptap/extension-collaboration';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

interface Props {
  documentId: string;
  branchId: string;
}

const CollaborativeEditor = ({ documentId, branchId }: Props) => {
  const doc = useMemo(() => new Y.Doc(), []);

  const provider = useMemo(() => {
    const p = new WebsocketProvider(
      'ws://localhost:1234',
      `${documentId}:${branchId}`,
      doc
    );
    return p;
  }, [documentId, doc]);

  useEffect(() => {
    return () => {
      provider.destroy();
      doc.destroy();
    };
  }, [provider, doc]);

  const editor = useEditor({
    extensions: [
      ...editorExtensions,
      Collaboration.configure({
        document: doc,
      }),
    ],
    ...commonEditorConfigs,
  });

  return (
    <CoreEditor
      enableAutoSaver={false}
      editor={editor}
      documentId={documentId}
      branchId={branchId}
    />
  );
};

export default CollaborativeEditor;
