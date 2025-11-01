import { useParams } from 'react-router-dom';
import { useSaveDocumentContent } from '../../../hooks/useSaveDocumentContent';
import { useDocumentContent } from '../../../hooks/useDocumentContent';
import MainEditor from '../components/MainEditor';
import EditorContainer from '../components/EditorContainer';

export const BaseEditor = () => {
  const { documentId, branchId } = useParams();
  const { data } = useDocumentContent(documentId ?? '', branchId ?? '');
  const { mutate } = useSaveDocumentContent(documentId ?? '', branchId ?? '');

  if (!data || !(documentId && branchId)) return null;

  const saveChanges = (content: string) => {
    mutate(JSON.stringify(content));
  };

  return (
    <EditorContainer>
      <MainEditor />
    </EditorContainer>
  );
};

export default BaseEditor;
