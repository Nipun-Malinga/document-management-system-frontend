import { HiDotsVertical } from 'react-icons/hi';
import { IoMenu } from 'react-icons/io5';
import useAside from '../../states/useAside';
import Button from '../common/Button';
import SearchInput from '../common/SearchInput';
import DarkThemeButton from '../common/DarkThemeButton';

const TopBar = () => {
  const { toggle } = useAside();

  return (
    <div className='w-full flex flex-row justify-between items-center gap-3 md:gap-4'>
      <div className='md:hidden shrink-0'>
        <Button type='button' icon={IoMenu} onClick={toggle} />
      </div>

      <div className='flex-1 max-w-2xl mx-auto'>
        <SearchInput output={(value) => {}} />
      </div>

      <div className='flex items-center gap-1.5 shrink-0'>
        <DarkThemeButton />
        <Button type='button' icon={HiDotsVertical} onClick={() => {}} />
      </div>
    </div>
  );
};

export default TopBar;