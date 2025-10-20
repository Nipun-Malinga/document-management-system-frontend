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
        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 md:gap-2'
      >
        {data?.data &&
          data.data.map((item) => (
            <DocumentCard
              key={item.id}
              documentId={item.id}
              title={item.title}
              state={item.status}
              createdDate={item.createdAt}
              updatedDate={item.updatedAt}
            />
          ))}
      </div>
    </>
  );
};

export default DocumentGrid;
