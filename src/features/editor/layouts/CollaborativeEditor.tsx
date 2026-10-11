import { collectionErrorMessage } from '@/utils/collectionUtils';
import { Button } from '@/components/ui/button';
import { useParams } from 'react-router-dom';
import EditorContainer from '../components/EditorContainer';
import CollaborativeEditorCore from '../components/CollaborativeEditorCore';
import useDocumentAccess from '@/hooks/document/useDocumentAccess';

const CollaborativeEditor = () => {
  const { documentId, branchId } = useParams();

  const access = useDocumentAccess(documentId ?? '', branchId ?? '');

  if (access.isPending) return <p role='status'>Checking document access...</p>;
  if (access.isError) return <div role='alert'><p>{collectionErrorMessage(access.error, 'document access')}</p><Button variant='outline' onClick={() => { void access.retry(); }}>Retry access check</Button></div>;
  if (!access.canRead) return <p role='alert'>You do not have access to this document.</p>;
  if (!(documentId && branchId)) return null;

  return (
    <EditorContainer>
      <CollaborativeEditorCore
        key={`${documentId}/${branchId}`}
        documentId={documentId}
        branchId={branchId}
        editable={access.canWrite}
      />
    </EditorContainer>
  );
};

export default CollaborativeEditor;
