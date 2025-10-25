import React from 'react';
import type { RenderElementProps, RenderLeafProps } from 'slate-react';
import { Editable } from 'slate-react';
import type { customEditor } from '../types';
import { toggleMark } from '../utils';
interface Props {
  editor?: customEditor;
  readonly?: boolean;
}

const Editor = ({ editor, readonly = false }: Props) => {
  const renderElement = ({
    attributes,
    element,
    children,
  }: RenderElementProps) => {
    return (
      <p {...attributes} style={{ textAlign: element.align }}>
        {children}
      </p>
    );
  };

  const renderLeaf = ({ attributes, children, leaf }: RenderLeafProps) => (
    <span
      {...attributes}
      className={`${leaf.bold ? 'font-bold' : ''} 
                  ${leaf.italic ? 'italic' : ''} 
                  ${leaf.underline ? 'underline' : ''} 
                  ${leaf.strikethrough ? 'line-through' : ''}
                  ${leaf.superscript ? 'text-xs relative -top-1' : ''}
                `}
    >
      {children}
    </span>
  );

  const toggleKeyboardEvents = (
    editor: customEditor,
    event: React.KeyboardEvent<HTMLDivElement>
  ) => {
    const key = event.key.toLowerCase();

    if (key === 'b' && event.ctrlKey) toggleMark(editor, 'bold');
    if (key === 'i' && event.ctrlKey) toggleMark(editor, 'italic');
    if (key === 'u' && event.ctrlKey) toggleMark(editor, 'underline');
    if (key === 'z' && event.ctrlKey) editor.undo();
    if (key === 'y' && event.ctrlKey) editor.redo();
  };

  return (
    <Editable
      className='min-h-full p-2.5 outline-none'
      readOnly={readonly}
      renderElement={renderElement}
      renderLeaf={renderLeaf}
      onKeyDown={(event) => {
        if (editor) {
          toggleKeyboardEvents(editor, event);
        }
      }}
    />
  );
};

export default React.memo(Editor);
