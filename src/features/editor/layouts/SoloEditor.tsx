import { useParams } from 'react-router-dom';
import EditorContainer from '../components/EditorContainer';
import SoloEditorCore from '../components/SoloEditorCore';
import { convertToTiptapContent } from '../utils';
import { useDocument, useDocumentContent } from '@/hooks/document';
import useDocumentAccess from '@/hooks/document/useDocumentAccess';
import { Button } from '@/components/ui/button';

export const SoloEditor = () => {
  const { documentId, branchId } = useParams();
  const metadata = useDocument(documentId ?? '');
  const contentQuery = useDocumentContent(documentId ?? '', branchId ?? '');
  const { data } = contentQuery;
  const access = useDocumentAccess(documentId ?? '', branchId ?? '');

  if (access.isPending) return <p role='status'>Checking document access...</p>;
  if (access.isError) return <p role='alert'>Unable to verify document access. Please try again.</p>;
  if (!access.canRead) return <p role='alert'>You do not have access to this document.</p>;

  if (!(documentId && branchId)) return null;
  if (!data) return contentQuery.isError ? <div role='alert'>
    <p>Unable to load saved content. The editor has not been opened.</p>
    <Button variant='outline' onClick={() => { void contentQuery.refetch(); }}>Retry loading content</Button>
  </div> : <p role='status'>Loading saved content…</p>;

  return (
    <EditorContainer>
      {metadata.data?.shared && <p role='alert'>Sharing changed while this solo editor was open. Editing is paused and local content is preserved; collaborative initialization must be verified before switching modes.</p>}
      <SoloEditorCore
        key={`${documentId}/${branchId}`}
        documentId={documentId}
        branchId={branchId}
        editable={access.canWrite && !metadata.data?.shared}
        content={convertToTiptapContent(data.content)}
      />
    </EditorContainer>
  );
};

export default SoloEditor;
