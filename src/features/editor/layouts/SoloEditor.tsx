import { useParams } from 'react-router-dom';
import { useDocumentContent } from '../../../hooks/useDocumentContent';
import EditorContainer from '../components/EditorContainer';
import SoloEditorCore from '../components/SoloEditorCore';
import { convertToTiptapContent } from '../utils';

export const BaseEditor = () => {
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

export default BaseEditor;
