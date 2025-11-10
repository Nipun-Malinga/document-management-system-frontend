import useUserSharedDocuments from '@/hooks/document/useUserSharedDocuments';
import DocumentGrid from '../components/DocumentGrid';
import DocumentCard from '../components/DocumentCard';

const Shared = () => {
  const { data } = useUserSharedDocuments();

  return (
    <DocumentGrid>
      {data?.data &&
        data.data.map((document, index) => (
          <DocumentCard document={document} key={index} />
        ))}
    </DocumentGrid>
  );
};

export default Shared;
