import React, { useState } from 'react';
import { createEditor } from 'slate';
import { Slate, withReact } from 'slate-react';
import type { customEditor, customElement, customText } from '../types';
import Editor from '../components/Editor';
import Toolbar from '../components/Toolbar';

interface Props {
  data: customElement[];
}

declare module 'slate' {
  interface CustomTypes {
    Editor: customEditor;
    Element: customElement;
    Text: customText;
  }
}

const RichTextEditor = ({ data }: Props) => {
  const [editor] = useState(() => withReact(createEditor()));
  return (
    <Slate
      editor={editor}
      initialValue={data}
      onChange={(value) => {
        const isAstChange = editor.operations.some(
          (op) => 'set_selection' !== op.type
        );
        if (isAstChange) {
          const content = JSON.stringify(value);
          localStorage.setItem('content', content);
        }
      }}
    >
      <Toolbar />
      <Editor editor={editor} />
    </Slate>
  );
};

export default React.memo(RichTextEditor);
