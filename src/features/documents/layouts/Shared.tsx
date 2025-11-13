import { Breadcrumb } from '@/components';
import { sharedWithMeBreadcrumb } from '@/data/breadcrumb/HomeBreadcrumbs';
import { useUserSharedDocuments } from '@/hooks/document';
import DocumentCard from '../components/DocumentCard';
import DocumentGrid from '../components/DocumentGrid';

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
