import { Outlet } from 'react-router-dom';
import { LayoutDarker, SideBar, TopBar } from '../components';
import useAside from '../states/useAside';

const Home = () => {
  const { collapsed } = useAside();

  return (
    <main className='h-svh flex md:grid md:grid-cols-[15rem_1fr] lg:grid-cols-[18rem_1fr] overflow-hidden'>
      <div className='hidden md:block border-r border-slate-300 dark:border-slate-600'>
        <SideBar />
      </div>

      {/* Mobile Sidebar */}
      <div className='md:hidden'>
        <SideBar />
      </div>

      <div className='relative flex-1 bg-white dark:bg-slate-900 flex flex-col overflow-hidden'>
        <LayoutDarker collapsed={collapsed} />
        
        <div className='p-2 shrink-0'>
          <TopBar />
        </div>

        <div className='flex-1 p-2 overflow-y-auto'>
          <Outlet />
        </div>
      </div>
    </main>
  );
};

export default Home;