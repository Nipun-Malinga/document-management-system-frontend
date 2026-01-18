import { useEditor, type Content } from '@tiptap/react';
import {
  commonEditorConfigs,
  editorExtensions,
} from '../configs/EditorConfigs';
import CoreEditor from './CoreEditor';
import Toolbar from './Toolbar';

interface Props {
  content: Content;
  documentId: string;
  branchId: string;
}

const SoloEditorCore = ({ content, documentId, branchId }: Props) => {
  const editor = useEditor({
    extensions: [...editorExtensions(false)],
    content: content,
    ...commonEditorConfigs,
  });

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
        onRedo={editor.chain().focus().redo().run}
        onUndo={editor.chain().focus().undo().run}
        disabled={false}
      />
    </CoreEditor>
  );
};

export default SoloEditorCore;
