import type { Editor } from '@tiptap/react';
import { Button } from '../../../components';
import AutoSaver from './AutoSaver';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

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
        <Button
          title='Preview'
          theme='primary'
          className='rounded-2xl'
          onClick={() =>
            navigate(`/document/${documentId}/branch/${branchId}/view`)
          }
        />
      </div>
    </div>
  );
};

export default TopToolBar;
