import { InfoPopUp } from '..';
import { useDocuments } from '../../../hooks/useDocuments';
import useInfoPopUp from '../../../states/useInfoPopUp';
import DocumentCard from './DocumentCard';

const DocumentGrid = () => {
  const { data } = useDocuments();
  const { documentId, collapsed, toggle } = useInfoPopUp();

  return (
    <>
      {documentId && <InfoPopUp documentId={documentId} />}
      <div
        onClick={() => !collapsed && toggle()}
        className='h-svh w-full pb-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 md:gap-2 overflow-y-auto'
      >
        {data?.data &&
          data.data.map((document) => <DocumentCard document={document} />)}
      </div>
    </>
  );
};

export default DocumentGrid;
