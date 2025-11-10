import type { ReactNode } from 'react';
import useInfoPopUp from '../../../states/useInfoPopUp';

interface Props {
  children: ReactNode;
}

const DocumentGrid = ({ children }: Props) => {
  const { collapsed, toggle } = useInfoPopUp();

  return (
    <div onClick={() => !collapsed && toggle()} className='h-full w-full'>
      <div className='pb-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-z xl:grid-cols-4 gap-1 md:gap-2 overflow-y-auto'>
        {children}
      </div>
    </div>
  );
};

export default DocumentGrid;
