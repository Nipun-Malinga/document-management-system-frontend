import { Breadcrumb, Container } from '@/components';
import { trashBreadcrumb } from '@/data/breadcrumb/HomeBreadcrumbs';

const Trash = () => {
  return (
    <Container>
      <Breadcrumb links={trashBreadcrumb} />
      Trash
    </Container>
  );
};

export default Trash;
