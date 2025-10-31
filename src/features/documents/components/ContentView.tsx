import { useParams } from 'react-router-dom';
import { ContentRenderer } from '../../../components';
import { useDocumentContent } from '../../../hooks/useDocumentContent';

const ContentView = () => {
  const { documentId, branchName } = useParams();
  const { data } = useDocumentContent(documentId ?? '', branchName ?? '');

  return (
    <div className='bw-full h-dvh rounded-md overflow-y-auto'>
      {data && <ContentRenderer />}
    </div>
  );
};

export default ContentView;
