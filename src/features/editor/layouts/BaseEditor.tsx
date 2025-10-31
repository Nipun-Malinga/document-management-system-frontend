import { useParams } from 'react-router-dom';
import { useSaveDocumentContent } from '../../../hooks/useDeleteDocumentContent';
import { useDocumentContent } from '../../../hooks/useDocumentContent';

export const BaseEditor = () => {
  const { documentId, branchId } = useParams();
  const { data } = useDocumentContent(documentId ?? '', branchId ?? '');
  const { mutate } = useSaveDocumentContent(documentId ?? '', branchId ?? '');

  if (!data || !(documentId && branchId)) return null;

  const saveChanges = (content: string) => {
    mutate(JSON.stringify(content));
  };

  return <></>;
};

export default BaseEditor;
