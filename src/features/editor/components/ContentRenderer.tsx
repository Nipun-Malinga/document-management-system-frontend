import type { Content } from '@tiptap/core';
import { EditorContent, useEditor } from '@tiptap/react';
import { editorExtensions } from '../configs/EditorConfigs';

interface Props {
  content: Content;
}

const ContentRenderer = ({ content }: Props) => {
  const editor = useEditor({
    extensions: [...editorExtensions(false)],
    content,
    editable: false, 
  });

  const SCALE = 0.35;

return (
  <div
    className="origin-top-left p-8.5"
    style={{
      transform: `scale(${SCALE})`,
      width: `${95 / SCALE}%`,
    }}
  >
    <EditorContent editor={editor} />
  </div>
);
};

export default ContentRenderer;
