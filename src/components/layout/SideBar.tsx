import { FaRegHardDrive } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';
import useAside from '../../states/useAside';
import Button from '../common/Button';
import { quicksAsides } from '../../data/Aside';
import Link from '../common/Link';
import type { IconType } from 'react-icons';

const SideBar = () => {
  const { collapsed, toggle } = useAside();

  return (
    <aside
      className={`absolute bg-white shadow-[0_3px_10px_rgb(0,0,0,0.3)] md:shadow-none z-1 w-3xs md:w-full h-lvh p-2 md:py-0 transform ${
        collapsed ? '-translate-x-full' : ''
      } transition-transform duration-250 ease-in-out md:relative md:translate-x-0`}
    >
      <div className='relative text-xl md:text-2xl lg:text-3xl mb-6 flex flex-row items-center gap-2 '>
        <FaRegHardDrive className='text-blue-600' />
        <h1 className='font-bold'>DocVault</h1>
        <div className='absolute right-0 md:hidden'>
          <Button
            type='button'
            icon={IoClose}
            theme='light'
            onClick={() => {
              toggle();
            }}
          />
        </div>
      </div>

      <nav className='border-b border-gray-300'>
        <p className='text-gray-600 text-xs md:text-base px-3 mb-2'>
          Quick Access
        </p>

        {quicksAsides.map((item, key) =>
          linkBody(item.icon, item.title, item.endpoint, item.count, key)
        )}
      </nav>
    </aside>
  );
};

const linkBody = (
  Icon: IconType,
  title: string,
  endpoint: string,
  count: number,
  key: any
) => (
  <Link
    children={
      <div className='w-full flex flex-row items-center'>
        <Icon className='text-lg mr-2' />
        <p className='text-sm'>{title}</p>
        <p className='ml-auto'>{count}</p>
      </div>
    }
    endpoint={endpoint}
    key={key}
  />
);

export default SideBar;
