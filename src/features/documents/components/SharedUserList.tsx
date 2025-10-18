import { useSharedUsers } from '../../../hooks/useSharedUsers';
import User from '../../users/components/User';

/*TODO: FETCH THE USER INFORMATION FROM THE SERVER BASED ON USER ID*/

interface Props {
  documentId: string;
}

const SharedUserList = ({ documentId }: Props) => {
  const { data } = useSharedUsers(documentId);

  return (
    <div className='relative'>
      {data?.data &&
        data.data.map((user, index) => (
          <div style={calculatePosition(index)} key={user.userId}>
            <User userId={user.userId} />
          </div>
        ))}
    </div>
  );
};

function calculatePosition(position: number): React.CSSProperties {
  return {
    zIndex: position,
    left: `${position}rem`,
    position: 'absolute',
  };
}

export default SharedUserList;
