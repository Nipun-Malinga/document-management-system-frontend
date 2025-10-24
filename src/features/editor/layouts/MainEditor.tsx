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

const MainEditor = ({ data }: Props) => {
  const [editor] = useState(() => withReact(createEditor()));
  return (
    <div className='space-y-1 py-2.5'>
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
        <hr className='text-gray-300' />
        <Editor editor={editor} />
      </Slate>
    </div>
  );
};

export default React.memo(MainEditor);
