import { Editor, useEditorState } from '@tiptap/react';
import React, { useState } from 'react';
import {
  FaAlignCenter,
  FaAlignJustify,
  FaAlignLeft,
  FaAlignRight,
  FaBold,
  FaCode,
  FaHighlighter,
  FaImage,
  FaItalic,
  FaLink,
  FaListOl,
  FaListUl,
  FaPalette,
  FaRedo,
  FaStrikethrough,
  FaUnderline,
  FaUndo,
  FaUnlink
} from 'react-icons/fa';
import { MdFormatClear } from 'react-icons/md';
import ToolButton from './ToolButton';

interface Props {
  editor: Editor;
}

const Toolbar = ({ editor }: Props) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);

  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      isBold: ctx.editor.isActive('bold'),
      isItalic: ctx.editor.isActive('italic'),
      isUnderline: ctx.editor.isActive('underline'),
      isStrike: ctx.editor.isActive('strike'),
      isCode: ctx.editor.isActive('code'),
      isBulletList: ctx.editor.isActive('bulletList'),
      isOrderedList: ctx.editor.isActive('orderedList'),
      isBlockquote: ctx.editor.isActive('blockquote'),
      isCodeBlock: ctx.editor.isActive('codeBlock'),
      isH1: ctx.editor.isActive('heading', { level: 1 }),
      isH2: ctx.editor.isActive('heading', { level: 2 }),
      isH3: ctx.editor.isActive('heading', { level: 3 }),
      isAlignLeft: ctx.editor.isActive({ textAlign: 'left' }),
      isAlignCenter: ctx.editor.isActive({ textAlign: 'center' }),
      isAlignRight: ctx.editor.isActive({ textAlign: 'right' }),
      isAlignJustify: ctx.editor.isActive({ textAlign: 'justify' }),
      canUndo: ctx.editor.can().undo(),
      canRedo: ctx.editor.can().redo(),
    }),
  });

  const colors = [
    '#000000',
    '#FF0000',
    '#00FF00',
    '#0000FF',
    '#FFFF00',
    '#FF00FF',
    '#00FFFF',
    '#FFA500',
  ];

  const setLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
    }
  };

  return (
    <div className='flex flex-wrap justify-center items-center gap-1 p-2 border-b border-gray-200'>
      {/* History */}
      <div className='flex items-center gap-1 pr-2 border-r border-gray-300'>
        <ToolButton
          icon={FaUndo}
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editorState.canUndo}
        />
        <ToolButton
          icon={FaRedo}
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editorState.canRedo}
        />
      </div>

      {/* Headings */}
      <div className='hidden md:flex items-center gap-1 pr-2 border-r border-gray-300'>
        <select
          onChange={(e) => {
            const value = e.target.value;
            if (value === 'p') {
              editor.chain().focus().setParagraph().run();
            } else {
              const level = parseInt(value) as 1 | 2 | 3 | 4 | 5 | 6;
              editor.chain().focus().toggleHeading({ level }).run();
            }
          }}
          className='px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
          value={
            editorState.isH1
              ? '1'
              : editorState.isH2
              ? '2'
              : editorState.isH3
              ? '3'
              : 'p'
          }
        >
          <option value='p'>Paragraph</option>
          <option value='1'>Heading 1</option>
          <option value='2'>Heading 2</option>
          <option value='3'>Heading 3</option>
        </select>
      </div>

      {/* Text Formatting */}
      <div className='flex items-center gap-1 pr-2 border-r border-gray-300'>
        <ToolButton
          icon={FaBold}
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editorState.isBold}
        />
        <ToolButton
          icon={FaItalic}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editorState.isItalic}
        />
        <ToolButton
          icon={FaUnderline}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editorState.isUnderline}
        />
        <ToolButton
          icon={FaStrikethrough}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editorState.isStrike}
        />
        <ToolButton
          icon={FaCode}
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editorState.isCode}
        />
      </div>

      {/* Colors */}
      <div className='hidden md:flex items-center gap-1 pr-2 border-r border-gray-300 relative'>
        <div className='relative'>
          <ToolButton
            icon={FaPalette}
            onClick={() => {
              setShowColorPicker(!showColorPicker);
              setShowHighlightPicker(false);
            }}
          />
          {showColorPicker && (
            <div className='absolute top-full mt-1 p-2 bg-white border border-gray-300 rounded shadow-lg z-10 grid grid-cols-4 gap-1'>
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => {}}
                  className='w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform'
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          )}
        </div>
        <div className='relative'>
          <ToolButton
            icon={FaHighlighter}
            onClick={() => {
              setShowHighlightPicker(!showHighlightPicker);
              setShowColorPicker(false);
            }}
          />
          {showHighlightPicker && (
            <div className='absolute top-full mt-1 p-2 bg-white border border-gray-300 rounded shadow-lg z-10 grid grid-cols-4 gap-1'>
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => {}}
                  className='w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform'
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          )}
        </div>
        <ToolButton
          icon={MdFormatClear}
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
        />
      </div>

      {/* Lists & Quotes */}
      <div className='flex items-center gap-1 pr-2 border-r border-gray-300'>
        <ToolButton
          icon={FaListUl}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editorState.isBulletList}
        />
        <ToolButton
          icon={FaListOl}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editorState.isOrderedList}
        />
      </div>

      {/* Links & Images */}
      <div className='hidden md:flex items-center gap-1 pr-2 border-r border-gray-300'>
        <ToolButton icon={FaLink} onClick={setLink} />
        <ToolButton
          icon={FaUnlink}
          onClick={() => editor.chain().focus().unsetLink().run()}
        />
        <ToolButton icon={FaImage} onClick={addImage} />
      </div>

      {/* Alignment */}
      <div className='flex items-center gap-1'>
        <ToolButton
          icon={FaAlignLeft}
          onClick={() => {
            editor.chain().focus().setTextAlign('left').run();
          }}
          active={editorState.isAlignLeft}
        />
        <ToolButton
          icon={FaAlignCenter}
          onClick={() => {
            editor.chain().focus().setTextAlign('center').run();
          }}
          active={editorState.isAlignCenter}
        />
        <ToolButton
          icon={FaAlignRight}
          onClick={() => {
            editor.chain().focus().setTextAlign('right').run();
          }}
          active={editorState.isAlignRight}
        />
        <ToolButton
          icon={FaAlignJustify}
          onClick={() => {
            editor.chain().focus().setTextAlign('justify').run();
          }}
          active={editorState.isAlignJustify}
        />
      </div>
    </div>
  );
};

export default React.memo(Toolbar);
