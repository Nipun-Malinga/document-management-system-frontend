import type { Editor } from '@tiptap/react';
import { Button } from '../../../components';
import AutoSaver from './AutoSaver';
import { useNavigate } from 'react-router-dom';
import DarkThemeButton from '@/components/common/DarkThemeButton';
import { InfoDrawer } from './info';

interface Props {
  documentTitle: string;
  enableAutoSaver: boolean;
  editor: Editor;
  documentId: string;
  branchId: string;
}

const TopToolBar = ({
  documentTitle,
  enableAutoSaver,
  editor,
  documentId,
  branchId,
}: Props) => {
  const navigate = useNavigate();

  return (
    <div className='flex items-center gap-2'>
      <h1 className='text-lg'>{documentTitle}</h1>
      <div className='ml-auto flex justify-center items-center gap-2'>
        {enableAutoSaver && (
          <AutoSaver
            editor={editor}
            documentId={documentId}
            branchId={branchId}
          />
        )}
        <Button
          title='Preview'
          className='rounded-2xl'
          onClick={() =>
            navigate(`/document/${documentId}/branch/${branchId}/view`)
          }
        />
        <DarkThemeButton />
        <InfoDrawer />
      </div>
    </div>
  );
};

export default TopToolBar;
