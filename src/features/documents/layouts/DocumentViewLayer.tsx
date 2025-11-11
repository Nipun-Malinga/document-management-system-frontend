import { Container, LayoutDarker } from '@/components';
import useInfoPopUp from '@/states/useInfoPopUp';
import type { ReactNode } from 'react';
import { InfoPopUp } from '..';

interface Props {
  children: ReactNode;
}

const DocumentViewLayer = ({ children }: Props) => {
  const { documentId, collapsed, toggle } = useInfoPopUp();

  return (
    <Container>
      <InfoPopUp documentId={documentId} />
      <LayoutDarker collapsed={collapsed} onClick={toggle} />
      {children}
    </Container>
  );
};

export default DocumentViewLayer;
