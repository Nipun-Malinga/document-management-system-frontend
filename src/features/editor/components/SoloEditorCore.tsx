import useSoloPersistence from '../persistence/useSoloPersistence';
import { useEditor, type Content } from '@tiptap/react';
import {
  commonEditorConfigs,
  editorExtensions,
} from '../configs/EditorConfigs';
import CoreEditor from './CoreEditor';
import Toolbar from './Toolbar';
import { useEffect } from 'react';

interface Props {
  content: Content;
  documentId: string;
  branchId: string;
  editable: boolean;
}

const SoloEditorCore = ({ content, documentId, branchId, editable }: Props) => {
  const editor = useEditor({
    extensions: [...editorExtensions(false)],
    content: content,
    editable,
    ...commonEditorConfigs,
  });

  const { state } = useSoloPersistence(editor, documentId, branchId, editable);
  const canEdit = editable && !state.locked;
  useEffect(() => {
    editor.setEditable(canEdit, false);
  }, [editor, canEdit]);

  return (
    <CoreEditor
      enableAutoSaver={true}
      editor={editor}
      documentId={documentId}
      branchId={branchId}
    >
      <Toolbar
        editor={editor}
        canRedo={true}
        canUndo={true}
        onRedo={() => { editor.chain().focus().redo().run(); }}
        onUndo={() => { editor.chain().focus().undo().run(); }}
        disabled={!canEdit}
      />
    </CoreEditor>
  );
};

export default SoloEditorCore;
