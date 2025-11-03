import { useEditor, type Content } from '@tiptap/react';
import {
  commonEditorConfigs,
  editorExtensions,
} from '../configs/EditorConfigs';
import MainEditor from './CoreEditor';

interface Props {
  content: Content;
  documentId: string;
  branchId: string;
}

const SoloEditorCore = ({ content, documentId, branchId }: Props) => {
  const editor = useEditor({
    extensions: [...editorExtensions],
    content: content,
    ...commonEditorConfigs,
  });

  return (
    <MainEditor
      enableAutoSaver={true}
      editor={editor}
      documentId={documentId}
      branchId={branchId}
    />
  );
};

export default SoloEditorCore;
