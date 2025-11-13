import DocumentGrid from '../components/DocumentGrid';
import DocumentCard from '../components/DocumentCard';
import { Breadcrumb, Container } from '@/components';
import { sharedWithMeBreadcrumb } from '@/data/breadcrumb/HomeBreadcrumbs';
import { useUserSharedDocuments } from '@/hooks/document';

const Shared = () => {
  const { data } = useUserSharedDocuments();

  return (
    <>
      <Breadcrumb links={sharedWithMeBreadcrumb} />
      <DocumentGrid>
        {data?.data &&
          data.data.map((document, index) => (
            <DocumentCard document={document} key={index} />
          ))}
      </DocumentGrid>
    </>
  );
};

export default Shared;
