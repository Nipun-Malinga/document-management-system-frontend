import { Container } from '@/components';
import useInfoPopUp from '@/states/useInfoPopUp';
import type { ReactNode } from 'react';
import { InfoPopUp } from '..';

interface Props {
  children: ReactNode;
}

const DocumentViewLayer = ({ children }: Props) => {
  const { documentId } = useInfoPopUp();

  return (
    <Container>
      <InfoPopUp documentId={documentId} />
      {children}
    </Container>
  );
};

export default DocumentViewLayer;
