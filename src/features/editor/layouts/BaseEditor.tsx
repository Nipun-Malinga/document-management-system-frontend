import { useParams } from 'react-router-dom';
import { useDocumentContent } from '../../../hooks/useDocumentContent';
import EditorContainer from '../components/EditorContainer';
import { convertToTiptapContent } from '../utils';
import { baseEditorConfigs } from '../configs/EditorConfigs';
import Editor from '../components/Editor';

export const BaseEditor = () => {
  const { documentId, branchId } = useParams();
  const { data } = useDocumentContent(documentId ?? '', branchId ?? '');

  if (!data || !(documentId && branchId)) return null;

  return (
    <EditorContainer>
      <Editor
        enableAutoSaver={true}
        documentId={documentId}
        branchId={branchId}
        configs={baseEditorConfigs}
        content={convertToTiptapContent(data.content)}
      />
    </EditorContainer>
  );
};

export default BaseEditor;
