import { ContentRenderer } from '../../../components';
import { useDocumentContent } from '../../../hooks/useDocumentContent';
import useBranch from '../../../states/useBranch';
import { parseData } from '../../editor/utils';

interface Props {
  documentId: string;
}

const ContentView = ({ documentId }: Props) => {
  const { branchName } = useBranch();
  const { data } = useDocumentContent(documentId, branchName);

  return (
    <div className='bg-blue-100 w-full h-50 rounded-md overflow-y-auto'>
      {data && <ContentRenderer content={parseData(data.content)} />}
    </div>
  );
};

export default ContentView;
