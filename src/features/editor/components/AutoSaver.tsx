import { useState, useEffect } from 'react';
import type { Editor } from '@tiptap/react';
import { useSaveDocumentContent } from '@/hooks/document';

interface Props {
  editor: Editor;
  documentId: string;
  branchId: string;
}

const AutoSaver = ({ editor, documentId, branchId }: Props) => {
  const { mutate, isPending, isSuccess } = useSaveDocumentContent(
    documentId,
    branchId
  );

  const [status, setStatus] = useState<'idle' | 'pending' | 'success'>('idle');

  useEffect(() => {
    if (isPending) setStatus('pending');
    else if (isSuccess) {
      setStatus('success');
      const timer = setTimeout(() => setStatus('idle'), 3000);
      return () => clearTimeout(timer);
    }
  }, [isPending, isSuccess]);

  useEffect(() => {
    const interval = setInterval(() => {
      const content = editor?.getJSON();
      if (content) mutate(JSON.stringify(content));
    }, 30000);

    return () => clearInterval(interval);
  }, [editor, mutate]);

  return (
    <div>
      {/* Pending (saving) indicator */}
      {status === 'idle' && (
        <span className='relative flex size-3'>
          <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-slate-400 opacity-75'></span>
          <span className='relative inline-flex size-3 rounded-full bg-slate-500'></span>
        </span>
      )}

      {/* Pending (saving) indicator */}
      {status === 'pending' && (
        <span className='relative flex size-3'>
          <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75'></span>
          <span className='relative inline-flex size-3 rounded-full bg-sky-500'></span>
        </span>
      )}

      {/* Success (saved) indicator */}
      {status === 'success' && (
        <span className='relative flex size-3'>
          <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75'></span>
          <span className='relative inline-flex size-3 rounded-full bg-green-500'></span>
        </span>
      )}
    </div>
  );
};

export default AutoSaver;
