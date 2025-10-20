import { Badge } from '../../../components';
import type { Document } from '../../../models/Document';

interface Props {
  document: Document;
}

const BadgeList = ({ document }: Props) => {
  return (
    <div className='flex flex-row justify-end gap-2'>
      {document.shared && <Badge text='SHARED' theme='dark' />}
      <Badge
        text={document.status ?? 'UNKNOWN'}
        theme={document.status == 'PRIVATE' ? 'secondary' : 'primary'}
      />
    </div>
  );
};

export default BadgeList;
