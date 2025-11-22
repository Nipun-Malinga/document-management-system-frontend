import { DrawerContent } from '@/components';
import useDocumentVersions from '@/hooks/document/useDocumentVersions';
import { useParams } from 'react-router-dom';
import InfoDrawerBody from '../InfoDrawerBody';
import VersionCard from './VersionCard';

const Versions = () => {
  const { documentId } = useParams();
  const { data } = useDocumentVersions(documentId ?? '');

  return (
    <DrawerContent
      title='Version History'
      description='View and restore previous versions of your document.'
    >
      <InfoDrawerBody emptyTitle='Versions' emptyDescription='' buttonTitle='Create Version'>
        {data?.data &&
          data.data.map((version) => (
            <VersionCard key={version.id} version={version} />
          ))}
      </InfoDrawerBody>
    </DrawerContent>
  );
};

export default Versions;
