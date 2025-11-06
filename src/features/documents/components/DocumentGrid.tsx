import { useDocuments } from '../../../hooks/useDocuments';
import useInfoPopUp from '../../../states/useInfoPopUp';
import DocumentCard from './DocumentCard';

const DocumentGrid = () => {
  const { data } = useDocuments();
  const { collapsed, toggle } = useInfoPopUp();

  return (
    <div onClick={() => !collapsed && toggle()} className='h-svh w-full'>
      <div className='pb-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-z xl:grid-cols-4 gap-1 md:gap-2 overflow-y-auto'>
        {data?.data &&
          data.data.map((document, index) => (
            <DocumentCard document={document} key={index} />
          ))}
      </div>
    </div>
  );
};

export default DocumentGrid;
