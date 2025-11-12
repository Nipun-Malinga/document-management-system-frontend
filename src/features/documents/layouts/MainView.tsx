import { Breadcrumb, Container } from '@/components';
import { mainViewBreadcrumb } from '@/data/breadcrumb/HomeBreadcrumbs';
import { useUserDocuments } from '@/hooks/document';
import DocumentCard from '../components/DocumentCard';
import DocumentGrid from '../components/DocumentGrid';

const MainView = () => {
  const { data } = useUserDocuments();

  return (
    <Container>
      <Breadcrumb links={mainViewBreadcrumb} />
      <DocumentGrid>
        {data?.data &&
          data.data
            .filter((item) => !item.trashed)
            .map((document, index) => (
              <DocumentCard document={document} key={index} />
            ))}
      </DocumentGrid>
    </Container>
  );
};

export default MainView;
