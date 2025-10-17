import Button from '../common/Button';
import SearchInput from '../common/SearchInput';
import { HiDotsVertical } from 'react-icons/hi';

const TopBar = () => {
  return (
    <div className='my-2'>
      <div className='w-full flex flex-row justify-between md:justify-center'>
        <div className='basis-full'>
          <SearchInput output={(value) => {}} />
        </div>
        <Button
          type='button'
          icon={HiDotsVertical}
          theme='light'
          onClick={() => {}}
        />
      </div>
    </div>
  );
};

export default TopBar;
