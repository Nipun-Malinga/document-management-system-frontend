import { Breadcrumb, Container } from '@/components';
import UserDocuments from '../components/UserDocuments';
import { mainViewBreadcrumb } from '@/data/breadcrumb/HomeBreadcrumbs';

const MainView = () => {
  return (
    <Container>
      <Breadcrumb links={mainViewBreadcrumb} />
      <UserDocuments />
    </Container>
  );
};

export default MainView;
