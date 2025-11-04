import { useEditor, type Content } from '@tiptap/react';
import {
  commonEditorConfigs,
  editorExtensions,
} from '../configs/EditorConfigs';
import MainEditor from './CoreEditor';
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
    <MainEditor
      enableAutoSaver={true}
      editor={editor}
      documentId={documentId}
      branchId={branchId}
      toolbar={
        <Toolbar
          editor={editor}
          canRedo={true}
          canUndo={true}
          onRedo={editor.chain().focus().redo().run}
          onUndo={editor.chain().focus().undo().run}
        />
      }
    />
  );
};

export default SoloEditorCore;
