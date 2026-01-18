import '../styles/styles.scss';

import { Editor, EditorContent, EditorContext } from '@tiptap/react';
import { useMemo, type ReactNode } from 'react';
import TopToolBar from './TopToolBar';
import { useDocument } from '@/hooks/document';

interface Props {
  enableAutoSaver: boolean;
  editor: Editor;
  documentId: string;
  branchId: string;
  children?: ReactNode;
}

const CoreEditor = ({
  enableAutoSaver,
  editor,
  documentId,
  branchId,
  children,
}: Props) => {
  const providerValue = useMemo(() => ({ editor }), [editor]);
  const { data } = useDocument(documentId);

  return (
    <EditorContext.Provider value={providerValue}>
      <div className='flex min-h-dvh flex-col bg-gray-50 dark:bg-gray-950'>
        <TopToolBar
          documentTitle={data?.title ?? 'Untitled Document'}
          enableAutoSaver={enableAutoSaver}
          editor={editor}
          documentId={documentId}
          branchId={branchId}
        />

        {children && (
          <div className='shrink-0 border-b border-gray-200 dark:border-gray-800'>
            {children}
          </div>
        )}

        <div className='flex-1 min-h-0 overflow-y-auto scrollbar-thin'>
          <div className='mx-auto max-w-4xl px-4 py-6 sm:px-8 sm:py-10'>
            <div className='rounded-xl border bg-white shadow-lg dark:bg-gray-800'>
              <EditorContent
                editor={editor}
                role='textbox'
                aria-label='Document editor'
                className='
              prose prose-sm sm:prose lg:prose-lg
              dark:prose-invert
              max-w-none
              px-4 py-6 sm:px-8 sm:py-10 md:px-16 md:py-16
              outline-none
            '
              />
            </div>
          </div>
        </div>
      </div>
    </EditorContext.Provider>
  );
};

export default CoreEditor;
