import { FaRegHardDrive } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';
import { quicksAsides } from '../../data/Aside';
import useAside from '../../states/useAside';
import Button from '../common/Button';
import Link from '../common/Link';

const SideBar = () => {
  const { collapsed, toggle } = useAside();

  return (
    <aside
      className={`absolute z-20 bg-white dark:bg-slate-900 w-70 md:w-full h-lvh p-2 transform ${
        collapsed && '-translate-x-80'
      } transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}
    >
      <div className='relative text-xl md:text-3xl mb-2 flex flex-row items-center gap-2'>
        <FaRegHardDrive className='text-blue-600' />
        <h1 className='font-bold'>DocVault</h1>
        <div className='absolute right-0 md:hidden'>
          <Button
            type='button'
            icon={IoClose}
            onClick={() => {
              toggle();
            }}
          />
        </div>
      </div>

      <nav className='border-b border-slate-300 dark:border-slate-600'>
        <p className='text-slate-600 dark:text-slate-300 text-xs md:text-base px-3 mb-2'>
          Quick Access
        </p>

        {quicksAsides.map((item, key) => (
          <Link key={key} endpoint={item.endpoint}>
            <div className='w-full px-2 py-2 md:px-4 md:py-2 flex flex-row items-center'>
              <item.icon className='text-lg mr-4' />
              <p className='text-sm text-slate-900 dark:text-slate-300'>
                {item.title}
              </p>
              <p className='text-sm text-slate-900 dark:text-slate-300 ml-auto'>
                {item.count}
              </p>
            </div>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default SideBar;
