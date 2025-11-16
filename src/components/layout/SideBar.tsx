import { FaRegHardDrive } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';
import useAside from '@/states/useAside';
import Button from '@/components/common/Button';
import Link from '@/components/common/Link';
import { useNavigate } from 'react-router-dom';
import type { SidebarLink } from '@/models/Link';

interface Props {
  sidebarLink: SidebarLink[];
}

const SideBar = ({ sidebarLink }: Props) => {
  const { collapsed, toggle } = useAside();
  const navigate = useNavigate();

  return (
    <aside
      className={`absolute z-20 bg-white dark:bg-gray-900 w-70 md:w-full h-lvh p-2 transform transition-transform duration-300 ease-in-out ${
        collapsed
          ? '-translate-x-80 md:translate-x-0'
          : 'translate-x-0 border-r'
      } md:relative`}
    >
      <div className='relative text-xl md:text-3xl mb-2 flex flex-row items-center gap-2'>
        <FaRegHardDrive className='text-blue-600' />
        <h1
          className='font-bold cursor-pointer'
          onClick={() => navigate('/dashboard/home')}
        >
          DocManager
        </h1>
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

      <nav className='border-b border-gray-300 dark:border-gray-600'>
        <p className='text-gray-600 dark:text-gray-300 text-xs md:text-base px-3 mb-2'>
          Quick Access
        </p>

        {sidebarLink.map((item, key) => (
          <Link key={key} endpoint={item.endpoint}>
            <div className='w-full px-2 py-2 md:px-4 md:py-2 flex flex-row items-center'>
              <item.icon className='text-lg mr-4' />
              <p className='text-sm text-gray-900 dark:text-gray-300'>
                {item.title}
              </p>
              <p className='text-sm text-gray-900 dark:text-gray-300 ml-auto'>
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
