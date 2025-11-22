import { useParams } from 'react-router-dom';
import EditorContainer from '../components/EditorContainer';
import SoloEditorCore from '../components/SoloEditorCore';
import { convertToTiptapContent } from '../utils';
import { useDocumentContent } from '@/hooks/document';

export const SoloEditor = () => {
  const { documentId, branchId } = useParams();
  const { data } = useDocumentContent(documentId ?? '', branchId ?? '');

  if (!data || !(documentId && branchId)) return null;

  return (
    <EditorContainer>
      <SoloEditorCore
        documentId={documentId}
        branchId={branchId}
        content={convertToTiptapContent(data.content)}
      />
    </EditorContainer>
  );
};

export default SoloEditor;
