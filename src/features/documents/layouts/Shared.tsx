import useUserSharedDocuments from '@/hooks/document/useUserSharedDocuments';
import DocumentGrid from '../components/DocumentGrid';
import DocumentCard from '../components/DocumentCard';
import { Breadcrumb, Container } from '@/components';
import { sharedWithMeBreadcrumb } from '@/data/breadcrumb/HomeBreadcrumbs';

const Shared = () => {
  const { data } = useUserSharedDocuments();

  return (
    <Container>
      <Breadcrumb links={sharedWithMeBreadcrumb} />
      <DocumentGrid>
        {data?.data &&
          data.data.map((document, index) => (
            <DocumentCard document={document} key={index} />
          ))}
      </DocumentGrid>
    </Container>
  );
};

export default Shared;
