import React, { useState } from 'react';
import { createEditor, type Descendant } from 'slate';
import { withHistory } from 'slate-history';
import { Slate, withReact } from 'slate-react';
import Editor from '../components/Editor';
import Toolbar from '../components/Toolbar';
import type { customEditor, customElement, customText } from '../types';

interface Props {
  data: customElement[];
  onChange: (value: Descendant[]) => void;
}

declare module 'slate' {
  interface CustomTypes {
    Editor: customEditor;
    Element: customElement;
    Text: customText;
  }
}

const MainEditor = ({ data, onChange }: Props) => {
  const [editor] = useState(() => withReact(withHistory(createEditor())));
  return (
    <div className='h-full py-1 space-y-1'>
      <Slate
        editor={editor}
        initialValue={data}
        onChange={(value) => onChange(value)}
      >
        <Toolbar />
        <hr className='text-gray-300' />
        <Editor editor={editor} />
      </Slate>
    </div>
  );
};

export default React.memo(MainEditor);
