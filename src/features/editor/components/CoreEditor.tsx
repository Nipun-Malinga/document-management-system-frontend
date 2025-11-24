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
  children: ReactNode;
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
      <div className='flex flex-col h-screen overflow-hidden bg-gray-50 dark:bg-gray-950'>
        <TopToolBar
          documentTitle={data?.title ?? 'Untitled Document'}
          enableAutoSaver={enableAutoSaver}
          editor={editor}
          documentId={documentId}
          branchId={branchId}
        />

        {children}

        <div className='flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent'>
          <div className='max-w-4xl mx-auto px-4 py-8 md:px-8 md:py-12'>
            <div className='bg-white dark:bg-gray-800 rounded-xl shadow-xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden'>
              <EditorContent
                editor={editor}
                className='prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none outline-none px-8 py-12 md:px-16 md:py-16 min-h-[calc(150vh-16rem)]'
              />
            </div>
          </div>
        </div>
      </div>
    </EditorContext.Provider>
  );
};

export default CoreEditor;
