import { useCallback, useSyncExternalStore } from 'react';
import type { Editor } from '@tiptap/react';
import { subscribeUploads, uploadMessage } from '../handlers/uploadFeedback';

const UploadFeedback = ({ editor }: { editor: Editor }) => {
  const subscribe = useCallback((listener: () => void) => subscribeUploads(editor, listener), [editor]);
  const message = useSyncExternalStore(subscribe, () => uploadMessage(editor));
  return message ? <p role='alert' className='p-3 text-sm text-destructive'>{message}</p> : null;
};
export default UploadFeedback;
