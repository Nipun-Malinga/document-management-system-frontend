import { useParams } from 'react-router-dom';
import { useDocumentContent } from '../../../hooks/useDocumentContent';
import RichTextEditor from './RichTextEditor';
import { parseData } from '../utils';

export const BaseEditor = () => {
  const { documentId, branchName } = useParams();
  const { data } = useDocumentContent(documentId ?? '', branchName ?? '');

  if (!data) return null;

  return <div>{data && <RichTextEditor data={parseData(data.content)} />}</div>;
}

export default BaseEditor;
