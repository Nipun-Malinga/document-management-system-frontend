import { DocumentGrid, InfoPopUp } from '..';
import { LayoutDarker } from '../../../components';
import useInfoPopUp from '../../../states/useInfoPopUp';

const DocumentContainer = () => {
  const { documentId, collapsed, toggle } = useInfoPopUp();
  return (
    <div className='w-full flex justify-center'>
      {documentId && <InfoPopUp documentId={documentId} />}
      <LayoutDarker collapsed={collapsed} zIndex={15} onClick={toggle} />
      <DocumentGrid />
    </div>
  );
};

export default DocumentContainer;
