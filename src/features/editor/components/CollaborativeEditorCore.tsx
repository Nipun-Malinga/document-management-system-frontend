import Collaboration from '@tiptap/extension-collaboration';
import { useEditor } from '@tiptap/react';
import { useMemo } from 'react';
  // import { IndexeddbPersistence } from 'y-indexeddb';
import { useProvider } from '@/hooks/document/collaboration';
import { useUser } from '@/hooks/user';
import { CollaborationCaret } from '@tiptap/extension-collaboration-caret';
import type { HocuspocusProvider } from '@hocuspocus/provider';
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

interface EditorProps extends Props {
  provider: HocuspocusProvider;
}

const CollaborativeEditorCore = (props: Props) => {
  const documentKey = `documents/${props.documentId}/branches/${props.branchId}`;
  const provider = useProvider(documentKey);

  if (!provider) return null;

  return (
    <CollaborativeEditor
      key={provider.document.guid}
      {...props}
      provider={provider}
    />
  );
};

const CollaborativeEditor = ({
  documentId,
  branchId,
  editable,
  provider,
}: EditorProps) => {
  const user = useUser();

  // Generate a random color for the user
  const currentUser = useMemo(
    () => ({
      name: user?.username || 'Anonymous',
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    }),
    [user?.username]
  );

  const editor = useEditor({
    extensions: [
      ...editorExtensions(true),
      Collaboration.configure({
        document: provider.document,
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

export default CollaborativeEditorCore;
