import type { Content } from '@tiptap/core';
import { EditorContent, useEditor } from '@tiptap/react';
import {
  editorExtensions,
  commonEditorConfigs,
} from '../configs/EditorConfigs';

interface Props {
  content: Content;
}

const ContentRenderer = ({ content }: Props) => {
  const editor = useEditor({
    extensions: [...editorExtensions(false)],
    content: content,
    editable: false,
    ...commonEditorConfigs,
  });
  return <EditorContent editor={editor} />;
};

export default ContentRenderer;
