import type { ReactNode } from 'react';
import { InfoPopUp } from '..';
import { LayoutDarker } from '../../../components';
import useInfoPopUp from '../../../states/useInfoPopUp';

interface Props {
  children?: ReactNode;
}

const DocumentViewLayer = ({ children }: Props) => {
  const { documentId, collapsed, toggle } = useInfoPopUp();
  return (
    <div className='w-full h-full flex justify-center'>
      <InfoPopUp documentId={documentId} />
      <LayoutDarker collapsed={collapsed} onClick={toggle} />
      {children}
    </div>
  );
};

export default DocumentViewLayer;
