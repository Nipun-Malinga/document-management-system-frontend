import type { Content } from '@tiptap/core';
import { EditorContent, useEditor } from '@tiptap/react';
import { editorExtensions } from '../configs/EditorConfigs';

interface Props {
  content: Content;
  type?: 'primary' | 'secondary';
}

const ContentRenderer = ({ content, type = 'primary' }: Props) => {
  const editor = useEditor({
    extensions: [...editorExtensions(false)],
    content,
    editable: false,
  });

  if (type === 'primary') {
    return (
      <div className='mx-auto max-w-4xl px-4 py-8 md:px-8 md:py-12'>
        <div className='rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800'>
          <EditorContent
            editor={editor}
            className='
                  prose prose-sm sm:prose lg:prose-lg
                  dark:prose-invert
                  max-w-none
                  px-8 py-12 md:px-16 md:py-16
                  outline-none
                '
          />
        </div>
      </div>
    );
  } else {
    const SCALE = 0.35;

    return (
      <div
        className='origin-top-left p-8.5'
        style={{
          transform: `scale(${SCALE})`,
          width: `${95 / SCALE}%`,
        }}
      >
        <EditorContent editor={editor} />
      </div>
    );
  }
};

export default ContentRenderer;
