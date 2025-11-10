import { useDocuments } from '@/hooks/useDocuments';
import DocumentCard from './DocumentCard';
import DocumentGrid from './DocumentGrid';

const UserDocuments = () => {
  const { data } = useDocuments();

  return (
    <div className='w-full h-full flex justify-center'>
      <DocumentGrid>
        {data?.data &&
          data.data.map((document, index) => (
            <DocumentCard document={document} key={index} />
          ))}
      </DocumentGrid>
    </div>
  );
};

export default UserDocuments;
