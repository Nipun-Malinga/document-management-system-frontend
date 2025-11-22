import { useParams } from 'react-router-dom';
import SoloEditor from './SoloEditor';
import CollaborativeEditor from './CollaborativeEditor';
import { useDocument } from '@/hooks/document';

const EditorContainer = () => {
  const { documentId } = useParams();
  const { data } = useDocument(documentId ?? '');
  return data ? data.shared ? <CollaborativeEditor /> : <SoloEditor /> : null;
};

export default EditorContainer;
