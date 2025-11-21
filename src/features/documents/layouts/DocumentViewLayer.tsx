import { Container } from '@/components';
import type { ReactNode } from 'react';
import { InfoPopup } from '../components/info';
import useDocumentInfoPopUp from '@/states/useDocumentInfoPopup';

interface Props {
  children: ReactNode;
}

const DocumentViewLayer = ({ children }: Props) => {
  const { documentId } = useDocumentInfoPopUp();

  return (
    <Container>
      <InfoPopup documentId={documentId} />
      {children}
    </Container>
  );
};

export default DocumentViewLayer;
