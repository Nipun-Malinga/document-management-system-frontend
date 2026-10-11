import { getSession } from '@/states/sessionStore';
import { registerPersistence } from '../persistence/persistenceRegistry';
import Collaboration from '@tiptap/extension-collaboration';
import { useEditor } from '@tiptap/react';
import { useEffect, useMemo, useState } from 'react';
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
import Button from '@/components/common/Button';
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
  useEffect(() => registerPersistence({ documentId, branchId, epoch: getSession().epoch, mode: 'collaborative', coordinator: null }), [documentId, branchId]);
  const [authenticationFailed, setAuthenticationFailed] = useState(false);
  const canEdit = editable && !authenticationFailed;
  useEffect(() => {
    const failed = () => setAuthenticationFailed(true);
    const authenticated = () => setAuthenticationFailed(false);
    provider.on('authenticationFailed', failed);
    provider.on('authenticated', authenticated);
    return () => {
      provider.off('authenticationFailed', failed);
      provider.off('authenticated', authenticated);
    };
  }, [provider]);

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
    editable: canEdit,
    ...commonEditorConfigs,
    onContentError: ({ disableCollaboration }) => {
      disableCollaboration();
    },
  });

  useEffect(() => {
    editor.setEditable(canEdit);
  }, [editor, canEdit]);

  return (
    <CoreEditor
      enableAutoSaver={false}
      editor={editor}
      documentId={documentId}
      branchId={branchId}
    >
      {authenticationFailed && (
        <div role='alert'>
          <p>Unable to authenticate collaboration. Editing is paused; your local document is preserved.</p>
          <Button title='Retry connection' onClick={() => {
            provider.configuration.websocketProvider.shouldConnect = true;
            void provider.connect().catch(() => {});
          }} />
        </div>
      )}
      <Toolbar
        editor={editor}
        canRedo={false}
        canUndo={false}
        disabled={!canEdit}
      />
    </CoreEditor>
  );
};

export default CollaborativeEditorCore;
