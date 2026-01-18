import { Container } from '@/components';
import { InfoPopup } from '../components/info';
import useDocumentInfoPopUp from '@/states/useDocumentInfoPopup';
import { Outlet } from 'react-router-dom';

const DocumentViewLayer = () => {
  const { documentId } = useDocumentInfoPopUp();

  return (
    <Container>
      <InfoPopup documentId={documentId} />
      <Outlet/>
    </Container>
  );
};

export default DocumentViewLayer;
