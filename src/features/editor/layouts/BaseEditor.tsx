import { useParams } from 'react-router-dom';
import { useDocumentContent } from '../../../hooks/useDocumentContent';
import { parseData } from '../utils';
import MainEditor from './MainEditor';

export const BaseEditor = () => {
  const { documentId, branchName } = useParams();
  const { data } = useDocumentContent(documentId ?? '', branchName ?? '');

  if (!data || !(documentId && branchName)) return null;

  return <>{data && <MainEditor data={parseData(data.content)} />}</>;
};

export default BaseEditor;
