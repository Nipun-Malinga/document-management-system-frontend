import { Container } from '@/components';
import useInfoPopUp from '@/states/useInfoPopUp';
import type { ReactNode } from 'react';
import { InfoPopup } from '../components/info';

interface Props {
  children: ReactNode;
}

const DocumentViewLayer = ({ children }: Props) => {
  const { documentId } = useInfoPopUp();

  return (
    <Container>
      <InfoPopup documentId={documentId} />
      {children}
    </Container>
  );
};

export default DocumentViewLayer;
