import Collaboration from '@tiptap/extension-collaboration';
import { useEditor } from '@tiptap/react';
import { useMemo } from 'react';
  // import { IndexeddbPersistence } from 'y-indexeddb';
import { useProvider } from '@/hooks/document/collaboration';
import { useUser } from '@/hooks/user';
import { CollaborationCaret } from '@tiptap/extension-collaboration-caret';
import * as Y from 'yjs';
import {
  commonEditorConfigs,
  editorExtensions,
} from '../configs/EditorConfigs';
import CoreEditor from './CoreEditor';
import Toolbar from './Toolbar';

interface Props {
  documentId: string;
  branchId: string;
  editable: boolean;
}

const CollaborativeEditor = ({ documentId, branchId, editable }: Props) => {
  // Unique key to identify the document
  const documentKey: string = `documents/${documentId}/branches/${branchId}`;

  const ydoc = useMemo(() => new Y.Doc(), []);
  const provider = useProvider(documentKey, ydoc);
  const user = useUser();

  // Generate a random color for the user
  const currentUser = useMemo(
    () => ({
      name: user?.username || 'Anonymous',
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    }),
    [user?.username]
  );

  // For offline support
  // new IndexeddbPersistence(documentKey, ydoc);

  const editor = useEditor({
    extensions: [
      ...editorExtensions(true),
      Collaboration.configure({
        document: ydoc,
      }),
      CollaborationCaret.configure({
        provider: provider,
        user: currentUser,
      }),
    ],
    editable: editable,
    ...commonEditorConfigs,
    onContentError: ({ disableCollaboration }) => {
      disableCollaboration();
    },
  });

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
