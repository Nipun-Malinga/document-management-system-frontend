import DarkThemeButton from '@/components/common/DarkThemeButton';
import type { Editor } from '@tiptap/react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components';
import AutoSaver from './AutoSaver';
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
    <div className='sticky top-0 z-20 flex flex-col md:flex-row items-center gap-2 px-4 py-2 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950'>
      <Button
        title='Back to Home'
        className='order-3 md:order-1 rounded-2xl'
        onClick={() => navigate('/dashboard/home')}
      />

      <h1 className='order-1 md:order-2 text-lg font-medium truncate max-w-full md:max-w-md'>
        {documentTitle}
      </h1>

      <div className='order-2 md:order-3 md:ml-auto flex items-center gap-2 shrink-0'>
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
