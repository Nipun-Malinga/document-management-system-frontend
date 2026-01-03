import Link from '@/components/common/Link';
import { navbarData } from '@/data/Navbar';
import { Menu } from 'lucide-react';
import Logo from '../common/Logo';

const Navbar = () => {
  return (
    <header className='sticky top-0 z-50 bg-white dark:bg-gray-900 border-b-2 border-gray-200 dark:border-gray-700 shadow-sm'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          <div className='shrink-0'>
            <Logo />
          </div>

          <nav className='hidden md:flex items-center justify-center space-x-1'>
            {navbarData.map((item, key) => (
              <Link
                key={key}
                title={item.title}
                endpoint={item.url}
                className='  text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-150'
              />
            ))}
          </nav>

          <div className='md:hidden'>
            <button type='button' aria-label='Open menu'>
              <Menu />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
