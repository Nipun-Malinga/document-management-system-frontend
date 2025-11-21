import type { ReactNode } from 'react';
import useDocumentInfoPopUp from '@/states/useDocumentInfoPopup';

interface Props {
  children: ReactNode;
}

const DocumentGrid = ({ children }: Props) => {
  const { collapsed, toggleDocumentInfoPopup } = useDocumentInfoPopUp();

  return (
    <div
      onClick={() => !collapsed && toggleDocumentInfoPopup()}
      className='w-full'
    >
      <div className='pt-2.5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-z xl:grid-cols-4 gap-1 md:gap-2 overflow-y-auto'>
        {children}
      </div>
    </div>
  );
};

export default DocumentGrid;
