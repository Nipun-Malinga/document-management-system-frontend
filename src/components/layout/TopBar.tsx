import useAside from '../../states/useAside';
import Button from '../common/Button';
import SearchInput from '../common/SearchInput';
import { HiDotsVertical } from 'react-icons/hi';
import { IoMenu } from 'react-icons/io5';

const TopBar = () => {
  const { toggle } = useAside();

  return (
    <div className='w-full mb-2 flex flex-row justify-between md:justify-center gap-2'>
      <div className='md:hidden'>
        <Button
          type='button'
          icon={IoMenu}
          theme='light'
          onClick={() => {
            toggle();
          }}
        />
      </div>

      <div className='basis-full'>
        <SearchInput output={(value) => {}} />
      </div>

      <div>
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
