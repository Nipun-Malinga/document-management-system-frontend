import { HTMLRenderer } from '../../../components';
import { useContent } from '../../../hooks/useContent';
import useBranch from '../../../states/useBranch';

interface Props {
  documentId: string;
}

const ContentView = ({ documentId }: Props) => {
  const { branchName } = useBranch();
  const { data } = useContent(documentId, branchName);

  return (
    <div className='bg-blue-100 w-full h-50 rounded-md overflow-y-auto'>
      {data && <HTMLRenderer content={data.content} />}
    </div>
  );
};

export default ContentView;
