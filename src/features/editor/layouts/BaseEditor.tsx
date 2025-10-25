import { useParams } from 'react-router-dom';
import type { Descendant } from 'slate';
import { useSaveDocumentContent } from '../../../hooks/useDeleteDocumentContent';
import { useDocumentContent } from '../../../hooks/useDocumentContent';
import { parseData } from '../utils';
import MainEditor from './MainEditor';

let timeout: number;

export const BaseEditor = () => {
  const { documentId, branchName } = useParams();
  const { data } = useDocumentContent(documentId ?? '', branchName ?? '');
  const { mutate } = useSaveDocumentContent(documentId ?? '', branchName ?? '');

  if (!data || !(documentId && branchName)) return null;

  const saveChanges = (content: Descendant[]) => {
    try {
      clearTimeout(timeout);

      timeout = setTimeout(() => {
        mutate(JSON.stringify(content));
      }, 5000);
    } catch (err) {
      console.error('Failed to pase document content data to json');
    }
  };

  return (
    <>
      {data && (
        <MainEditor data={parseData(data.content)} onChange={saveChanges} />
      )}
    </>
  );
};

export default BaseEditor;
