import { Breadcrumb, Container } from '@/components';
import { resentsBreadcrumb } from '@/data/breadcrumb/HomeBreadcrumbs';

const Resents = () => {
  return (
    <Container>
      <Breadcrumb links={resentsBreadcrumb} />
    </Container>
  );
};

export default Resents;
