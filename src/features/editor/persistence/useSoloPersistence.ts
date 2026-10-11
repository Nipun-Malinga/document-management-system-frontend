import { useEffect, useRef } from 'react';
import type { Editor } from '@tiptap/react';
import { useSaveDocumentContent } from '@/hooks/document';
import { getSession } from '@/states/sessionStore';
import { SaveCoordinator } from './SaveCoordinator';
import { registerPersistence, usePersistenceRegistry } from './persistenceRegistry';
import useSaveState from './useSaveState';
import { parseEditorContent } from './contentUtils';

const useSoloPersistence = (editor: Editor, documentId: string, branchId: string, editable: boolean) => {
  const { mutateAsync } = useSaveDocumentContent(documentId, branchId);
  const current = useRef({ editable, save: mutateAsync });
  current.current = { editable, save: mutateAsync };
  const active = usePersistenceRegistry((state) => state.active);
  const coordinator = active?.mode === 'solo' && active.documentId === documentId && active.branchId === branchId ? active.coordinator : null;
  const state = useSaveState(coordinator);

  useEffect(() => {
    const epoch = getSession().epoch;
    const save: SaveCoordinator = new SaveCoordinator({
      epoch, content: JSON.stringify(editor.getJSON()),
      save: (content) => current.current.save(content),
      canWrite: () => current.current.editable && (!save.getSnapshot().locked ? editor.isEditable : true) && !editor.isDestroyed && getSession().status === 'authenticated',
      apply: (content) => {
        editor.commands.setContent(parseEditorContent(content), { emitUpdate: false, errorOnInvalidContent: true });
        return JSON.stringify(editor.getJSON());
      },
      lock: (locked) => { if (!editor.isDestroyed) editor.setEditable(current.current.editable && !locked, false); },
    });
    const unregister = registerPersistence({ documentId, branchId, epoch, mode: 'solo', coordinator: save });
    const update = () => save.markDirty(JSON.stringify(editor.getJSON()));
    editor.on('update', update);
    const timer = setInterval(() => {
      const state = save.getSnapshot();
      if (save.dirty && !state.locked && state.status !== 'error' && current.current.editable) void save.flush().catch(() => {});
    }, 30000);
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (save.needsProtection) { event.preventDefault(); event.returnValue = ''; }
    };
    window.addEventListener('beforeunload', beforeUnload);
    return () => {
      clearInterval(timer);
      window.removeEventListener('beforeunload', beforeUnload);
      editor.off('update', update);
      unregister();
      save.dispose();
    };
  }, [editor, documentId, branchId]);
  return { coordinator, state };
};

export default useSoloPersistence;
