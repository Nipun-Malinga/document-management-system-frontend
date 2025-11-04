import { useParams } from 'react-router-dom';
import { useDocumentContent } from '../../../hooks/useDocumentContent';
import { ContentRenderer } from '../../editor';
import { convertToTiptapContent } from '../../editor/utils';

const ContentView = () => {
  const { documentId, branchId} = useParams();
  const { data } = useDocumentContent(documentId ?? '', branchId ?? '');

  if (!(documentId && branchId && data)) return null;

  return (
    <div className='bw-full h-dvh rounded-md overflow-y-auto'>
      <ContentRenderer content={convertToTiptapContent(data.content)} />
    </div>
  );
};

export default ContentView;
