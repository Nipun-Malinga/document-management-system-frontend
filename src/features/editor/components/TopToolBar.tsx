import type { Editor } from '@tiptap/react';
import { Button } from '../../../components';
import AutoSaver from './AutoSaver';

interface Props {
  enableAutoSaver: boolean;
  editor: Editor;
  documentId: string;
  branchId: string;
}

const TopToolBar = ({
  enableAutoSaver,
  editor,
  documentId,
  branchId,
}: Props) => {
  return (
    <div className='flex items-center gap-2'>
      {enableAutoSaver && (
        <AutoSaver
          editor={editor}
          documentId={documentId}
          branchId={branchId}
        />
      )}
      <div className='ml-auto'>
        <Button title='Preview' theme='primary' className='rounded-2xl' />
      </div>
    </div>
  );
};

export default TopToolBar;
