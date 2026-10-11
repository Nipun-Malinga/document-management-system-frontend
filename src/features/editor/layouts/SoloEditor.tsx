import { useParams } from 'react-router-dom';
import EditorContainer from '../components/EditorContainer';
import SoloEditorCore from '../components/SoloEditorCore';
import { convertToTiptapContent } from '../utils';
import { useDocumentContent } from '@/hooks/document';
import useDocumentAccess from '@/hooks/document/useDocumentAccess';

export const SoloEditor = () => {
  const { documentId, branchId } = useParams();
  const { data } = useDocumentContent(documentId ?? '', branchId ?? '');
  const access = useDocumentAccess(documentId ?? '', branchId ?? '');

  if (access.isPending) return <p role='status'>Checking document access...</p>;
  if (access.isError) return <p role='alert'>Unable to verify document access. Please try again.</p>;
  if (!access.canRead) return <p role='alert'>You do not have access to this document.</p>;

  if (!data || !(documentId && branchId)) return null;

  return (
    <EditorContainer>
      <SoloEditorCore
        key={`${documentId}/${branchId}`}
        documentId={documentId}
        branchId={branchId}
        editable={access.canWrite}
        content={convertToTiptapContent(data.content)}
      />
    </EditorContainer>
  );
};

export default SoloEditor;
