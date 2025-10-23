import React from 'react';
import type { RenderLeafProps } from 'slate-react';
import { Editable } from 'slate-react';
import type { customEditor } from '../types';
import { toggleKeyboardEvents } from '../utils';

interface Props {
  editor?: customEditor;
  readonly?: boolean;
}

const renderLeaf = ({ attributes, children, leaf }: RenderLeafProps) => (
  <span
    {...attributes}
    className={`${leaf.bold ? 'font-bold' : ''} 
                ${leaf.italic ? 'italic' : ''} 
                ${leaf.underline ? 'underline' : ''} 
                ${leaf.strikethrough ? 'line-through' : ''}
                ${leaf.superscript ? 'text-xs relative -top-1' : ''}
                ${leaf.subscript ? 'text-xs relative top-1' : ''}
              `}
  >
    {children}
  </span>
);

const Editor = ({ editor, readonly = false }: Props) => {
  return (
    <div className='p-0.5'>
      <Editable
        readOnly={readonly}
        renderLeaf={renderLeaf}
        onKeyDown={(event) => {
          editor && toggleKeyboardEvents(editor, event);
        }}
      />
    </div>
  );
};

export default React.memo(Editor);
