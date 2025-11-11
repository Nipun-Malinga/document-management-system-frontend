import { useUserDocuments } from '@/hooks/document';
import DocumentCard from './DocumentCard';
import DocumentGrid from './DocumentGrid';

const UserDocuments = () => {
  const { data } = useUserDocuments();

  return (
    <DocumentGrid>
      {data?.data &&
        data.data.map((document, index) => (
          <DocumentCard document={document} key={index} />
        ))}
    </DocumentGrid>
  );
};

export default UserDocuments;
