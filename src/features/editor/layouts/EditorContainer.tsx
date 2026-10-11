import { useState } from 'react';
import { useParams } from 'react-router-dom';
import SoloEditor from './SoloEditor';
import CollaborativeEditor from './CollaborativeEditor';
import { useDocument } from '@/hooks/document';
import EditorNavigationGuard from '../persistence/EditorNavigationGuard';

// A metadata refresh must not replace a mounted editor with a different persistence mode.
const EditorMode = ({ shared }: { shared: boolean }) => {
  const [collaborative] = useState(shared);
  return <>{collaborative ? <CollaborativeEditor /> : <SoloEditor />}</>;
};

const EditorContainer = () => {
  const { documentId, branchId } = useParams();
  const { data, isError } = useDocument(documentId ?? '');
  return <>
    <EditorNavigationGuard />
    {data ? <EditorMode key={`${documentId}/${branchId}`} shared={data.shared} /> :
      <p role={isError ? 'alert' : 'status'}>{isError ? 'Unable to load this document.' : 'Loading document…'}</p>}
  </>;
};
export default EditorContainer;
