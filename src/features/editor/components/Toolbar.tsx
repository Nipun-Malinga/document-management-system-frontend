import type { Editor } from '@tiptap/core';
import { useEditorState } from '@tiptap/react';
import { useCallback, useEffect, useState } from 'react';
import {
  FaRedo,
  FaUndo,
  FaUnlink,
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
} from 'react-icons/fa';
import { MdFormatClear } from 'react-icons/md';
import ToolButton from './ToolButton';

interface Props {
  editor: Editor;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  disabled: boolean;
}

const COLORS = [
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

const Toolbar = ({
  editor,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  disabled,
}: Props) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);

  /** Close popovers when toolbar is disabled */
  useEffect(() => {
    if (disabled) {
      setShowColorPicker(false);
      setShowHighlightPicker(false);
    }
  }, [disabled]);

  const editorState = useEditorState({
    editor,
    selector(ctx) {
      return {
        bold: ctx.editor.isActive('bold'),
        italic: ctx.editor.isActive('italic'),
        underline: ctx.editor.isActive('underline'),
        strike: ctx.editor.isActive('strike'),
        code: ctx.editor.isActive('code'),
        bullet: ctx.editor.isActive('bulletList'),
        ordered: ctx.editor.isActive('orderedList'),
        left: ctx.editor.isActive({ textAlign: 'left' }),
        center: ctx.editor.isActive({ textAlign: 'center' }),
        right: ctx.editor.isActive({ textAlign: 'right' }),
        justify: ctx.editor.isActive({ textAlign: 'justify' }),
      };
    },
  });

  const addImage = useCallback(() => {
    const url = window.prompt('Image URL');
    if (url) editor.chain().focus().setImage({ src: url }).run();
  }, [editor]);

  const setLink = () => {
    const url = window.prompt('Enter URL');
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div className="relative overflow-visible border-b border-gray-200 dark:border-gray-700">
      <div
        className={`
          flex items-center gap-2
          px-3 py-2
          overflow-x-auto whitespace-nowrap
          scrollbar-thin
          md:flex-wrap md:overflow-visible
          ${disabled ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        {/* History */}
        {onUndo && onRedo && (
          <div className="flex items-center gap-1 md:border-r md:pr-2">
            <ToolButton icon={FaUndo} onClick={onUndo} disabled={!canUndo} />
            <ToolButton icon={FaRedo} onClick={onRedo} disabled={!canRedo} />
          </div>
        )}

        {/* Headings (space reserved to avoid jump) */}
        <div className="hidden md:flex w-[140px] md:border-r md:pr-2">
          <select
            className="w-full px-2 py-1.5 text-sm rounded-lg border dark:bg-gray-900"
            value={
              editor.isActive('heading', { level: 1 })
                ? '1'
                : editor.isActive('heading', { level: 2 })
                ? '2'
                : editor.isActive('heading', { level: 3 })
                ? '3'
                : 'p'
            }
            onChange={(e) => {
              const v = e.target.value;
              if (v === 'p') {
                editor.chain().focus().setParagraph().run();
              } else {
                editor.chain().focus().toggleHeading({ level: +v as 1 | 2 | 3 }).run();
              }
            }}
          >
            <option value="p">Paragraph</option>
            <option value="1">Heading 1</option>
            <option value="2">Heading 2</option>
            <option value="3">Heading 3</option>
          </select>
        </div>

        {/* Text formatting */}
        <div className="flex items-center gap-1 md:border-r md:pr-2">
          <ToolButton icon={FaBold} active={editorState.bold} onClick={() => editor.chain().focus().toggleBold().run()} />
          <ToolButton icon={FaItalic} active={editorState.italic} onClick={() => editor.chain().focus().toggleItalic().run()} />
          <ToolButton icon={FaUnderline} active={editorState.underline} onClick={() => editor.chain().focus().toggleUnderline().run()} />
          <ToolButton icon={FaStrikethrough} active={editorState.strike} onClick={() => editor.chain().focus().toggleStrike().run()} />
          <ToolButton icon={FaCode} active={editorState.code} onClick={() => editor.chain().focus().toggleCode().run()} />
        </div>

        {/* Colors */}
        <div className="hidden md:flex items-center gap-1 md:border-r md:pr-2 relative">
          <ToolButton
            icon={FaHighlighter}
            onClick={() => {
              setShowHighlightPicker((v) => !v);
              setShowColorPicker(false);
            }}
          />
          {showHighlightPicker && (
            <div className="absolute right-0 md:left-0 top-full mt-2 z-50 grid grid-cols-4 gap-2 p-3 w-36 rounded-xl bg-white dark:bg-gray-800 border shadow-xl">
              {COLORS.map((c) => (
                <button
                  key={c}
                  className="w-7 h-7 rounded-md border"
                  style={{ backgroundColor: c }}
                  onClick={() => {
                    editor.chain().focus().setColor(c).run();
                    setShowHighlightPicker(false);
                  }}
                />
              ))}
            </div>
          )}

          <ToolButton
            icon={FaPalette}
            onClick={() => {
              setShowColorPicker((v) => !v);
              setShowHighlightPicker(false);
            }}
          />
          {showColorPicker && (
            <div className="absolute right-0 md:left-0 top-full mt-2 z-50 grid grid-cols-4 gap-2 p-3 w-36 rounded-xl bg-white dark:bg-gray-800 border shadow-xl">
              {COLORS.map((c) => (
                <button
                  key={c}
                  className="w-7 h-7 rounded-md border"
                  style={{ backgroundColor: c }}
                  onClick={() => {
                    editor.chain().focus().setBackgroundColor(c).run();
                    setShowColorPicker(false);
                  }}
                />
              ))}
            </div>
          )}

          <ToolButton icon={MdFormatClear} onClick={() => editor.chain().focus().unsetAllMarks().run()} />
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1 md:border-r md:pr-2">
          <ToolButton icon={FaListUl} active={editorState.bullet} onClick={() => editor.chain().focus().toggleBulletList().run()} />
          <ToolButton icon={FaListOl} active={editorState.ordered} onClick={() => editor.chain().focus().toggleOrderedList().run()} />
        </div>

        {/* Links & images */}
        <div className="hidden md:flex items-center gap-1 md:border-r md:pr-2">
          <ToolButton icon={FaLink} onClick={setLink} />
          <ToolButton icon={FaUnlink} onClick={() => editor.chain().focus().unsetLink().run()} />
          <ToolButton icon={FaImage} onClick={addImage} />
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-1">
          <ToolButton icon={FaAlignLeft} active={editorState.left} onClick={() => editor.chain().focus().setTextAlign('left').run()} />
          <ToolButton icon={FaAlignCenter} active={editorState.center} onClick={() => editor.chain().focus().setTextAlign('center').run()} />
          <ToolButton icon={FaAlignRight} active={editorState.right} onClick={() => editor.chain().focus().setTextAlign('right').run()} />
          <ToolButton icon={FaAlignJustify} active={editorState.justify} onClick={() => editor.chain().focus().setTextAlign('justify').run()} />
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
