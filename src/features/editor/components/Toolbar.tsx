import type { Editor } from '@tiptap/core';
import { useEditorState } from '@tiptap/react';
import { useCallback, useState } from 'react';
import { FaRedo, FaUndo, FaUnlink } from 'react-icons/fa';
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
  FaStrikethrough,
  FaUnderline,
} from 'react-icons/fa6';
import { MdFormatClear } from 'react-icons/md';
import ToolButton from './ToolButton';

interface Props {
  editor: Editor;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
}

const Toolbar = ({ editor, canUndo, canRedo, onUndo, onRedo }: Props) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);

  const editorState = useEditorState({
    editor: editor,
    selector(ctx) {
      return {
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
      };
    },
  });

  const colors = [
    '#FFFFFF',
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
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  const addImage = useCallback(() => {
    const url = window.prompt('URL');

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  return (
    <div className='flex flex-wrap justify-center items-center gap-1 p-2 border-b border-slate-200'>
      {/* History (only render if solo editor) */}
      {onUndo && onRedo && (
        <div className='flex items-center gap-1 pr-2 border-r border-slate-300'>
          <ToolButton icon={FaUndo} onClick={onUndo} disabled={!canUndo} />
          <ToolButton icon={FaRedo} onClick={onRedo} disabled={!canRedo} />
        </div>
      )}

      {/* Headings */}
      <div className='hidden md:flex items-center gap-1 pr-2 border-r border-slate-300'>
        <select
          onChange={(e) => {
            const value = e.target.value;
            if (value === 'p') {
              editor.chain().focus().setParagraph().run();
            } else {
              const level = parseInt(value) as 1 | 2 | 3 | 4 | 5 | 6;
              editor.chain().focus().toggleHeading({ level: level }).run();
            }
          }}
          className='px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
          value={
            editor.isActive('heading', { level: 1 })
              ? '1'
              : editor.isActive('heading', { level: 2 })
              ? '2'
              : editor.isActive('heading', { level: 3 })
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
      <div className='flex items-center gap-1 pr-2 border-r border-slate-300'>
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
      <div className='hidden md:flex items-center gap-1 pr-2 border-r border-slate-300 relative'>
        <div className='relative'>
          <ToolButton
            icon={FaHighlighter}
            onClick={() => {
              setShowHighlightPicker(!showHighlightPicker);
              setShowColorPicker(false);
            }}
          />
          {showHighlightPicker && (
            <div className='absolute w-30 top-full mt-1 p-2 bg-white border border-slate-300 rounded shadow-lg z-10 grid grid-cols-4 gap-1'>
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    editor.chain().focus().setColor(color).run();
                    setShowHighlightPicker(false);
                  }}
                  className='w-6 h-6 rounded border border-slate-300 hover:scale-110 transition-transform cursor-pointer'
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          )}
        </div>
        <div className='relative'>
          <ToolButton
            icon={FaPalette}
            onClick={() => {
              setShowColorPicker(!showColorPicker);
              setShowHighlightPicker(false);
            }}
          />
          {showColorPicker && (
            <div className='absolute w-30 top-full mt-1 p-2 bg-white border border-slate-300 rounded shadow-lg z-10 grid grid-cols-4 gap-1'>
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    editor.chain().focus().setBackgroundColor(color).run();
                    setShowColorPicker(false);
                  }}
                  className='w-6 h-6 rounded border border-slate-300 hover:scale-110 transition-transform cursor-pointer'
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
      <div className='flex items-center gap-1 pr-2 border-r border-slate-300'>
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
      <div className='hidden md:flex items-center gap-1 pr-2 border-r border-slate-300'>
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

export default Toolbar;
