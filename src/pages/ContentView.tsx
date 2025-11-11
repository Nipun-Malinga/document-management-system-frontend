import { useParams } from 'react-router-dom';
import { ContentRenderer } from '../features/editor';
import { convertToTiptapContent } from '../features/editor/utils';
import { useDocumentContent } from '@/hooks/document';

const ContentView = () => {
  const { documentId, branchId } = useParams();
  const { data } = useDocumentContent(documentId ?? '', branchId ?? '');

  if (!(documentId && branchId && data)) return null;

  return (
    <div className='bw-full h-dvh rounded-md overflow-y-auto'>
      <ContentRenderer content={convertToTiptapContent(data.content)} />
    </div>
  );
};

export default ContentView;
