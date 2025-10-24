import { useState } from 'react';
import { createEditor } from 'slate';
import { Slate, withReact } from 'slate-react';
import Editor from '../../features/editor/components/Editor';
import type { customEditor, customElement } from '../../features/editor/types';

interface Props {
  content: customElement[];
}

const ContentRenderer = ({ content }: Props) => {
  const [editor] = useState<customEditor>(withReact(createEditor()));

  return (
    <Slate editor={editor} initialValue={content}>
      <Editor readonly={true} />
    </Slate>
  );
};

export default ContentRenderer;
