import { InfoPopUp } from '..';
import { useDocuments } from '../../../hooks/useDocuments';
import useInfoPopUp from '../../../states/useInfoPopUp';
import DocumentCard from './DocumentCard';

const DocumentGrid = () => {
  const { data } = useDocuments();
  const { collapsed } = useInfoPopUp();

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 md:gap-2'>
      <div
        className={`absolute z-10 md:top-30 w-fit justify-self-center md:self-center transition duration-100 ease-in-out ${
          collapsed ? 'opacity-0 pointer-events-none' : 'fixed opacity-100'
        }`}
      >
        <InfoPopUp />
      </div>
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
  );
};

export default DocumentGrid;
