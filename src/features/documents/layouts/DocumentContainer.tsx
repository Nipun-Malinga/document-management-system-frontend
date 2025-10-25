import { DocumentGrid, InfoPopUp } from '..';
import { LayoutDarker } from '../../../components';
import useInfoPopUp from '../../../states/useInfoPopUp';

const DocumentContainer = () => {
  const { documentId, collapsed, toggle } = useInfoPopUp();
  return (
    <div className='w-full flex justify-center'>
      <InfoPopUp documentId={documentId} />
      <LayoutDarker collapsed={collapsed} onClick={toggle} />
      <DocumentGrid />
    </div>
  );
};

export default DocumentContainer;
