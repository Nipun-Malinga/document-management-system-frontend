import { Breadcrumb, Container } from '@/components';
import { quickAccessBreadcrumb } from '@/data/breadcrumb/HomeBreadcrumbs';

const Quick = () => {
  return (
    <Container>
      <Breadcrumb links={quickAccessBreadcrumb} />
      Quick
    </Container>
  );
};

export default Quick;
