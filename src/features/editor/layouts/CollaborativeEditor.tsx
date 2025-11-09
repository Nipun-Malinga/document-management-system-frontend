import { useParams } from 'react-router-dom';
import EditorContainer from '../components/EditorContainer';
import CollaborativeEditorCore from '../components/CollaborativeEditorCore';
import { useValidatePermissions } from '@/hooks/collaboration/useValidatePermissions';

const CollaborativeEditor = () => {
  const { documentId, branchId } = useParams();

  const { data } = useValidatePermissions(documentId ?? '', branchId ?? '');

  if (!(data && documentId && branchId)) return null;

  return (
    <EditorContainer>
      <CollaborativeEditorCore
        documentId={documentId}
        branchId={branchId}
        editable={data.permission !== 'READ_ONLY'}
      />
    </EditorContainer>
  );
};

export default CollaborativeEditor;
