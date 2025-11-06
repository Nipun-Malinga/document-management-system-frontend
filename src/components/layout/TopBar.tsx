import { HiDotsVertical } from 'react-icons/hi';
import { IoMenu } from 'react-icons/io5';
import useAside from '../../states/useAside';
import Button from '../common/Button';
import SearchInput from '../common/SearchInput';
import DarkThemeButton from '../common/DarkThemeButton';

const TopBar = () => {
  const { toggle } = useAside();

  return (
    <div className='w-full flex flex-row justify-between items-center md:justify-center gap-2'>
      <div className='md:hidden'>
        <Button type='button' icon={IoMenu} onClick={toggle} />
      </div>

      <div className='basis-full'>
        <SearchInput output={(value) => {}} />
      </div>

      <div className='flex gap-0.5'>
        <DarkThemeButton />
        <Button type='button' icon={HiDotsVertical} onClick={() => {}} />
      </div>
    </div>
  );
};

export default TopBar;
