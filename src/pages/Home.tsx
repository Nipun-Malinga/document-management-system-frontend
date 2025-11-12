import { Outlet } from 'react-router-dom';
import { LayoutDarker, SideBar, TopBar } from '@/components';
import useAside from '@/states/useAside';
import useInfoPopUp from '@/states/useInfoPopUp';

const Home = () => {
  const { collapsed } = useAside();
  const { collapsed: infoPopupCollapsed, toggle: toggleInfoPopup } =
    useInfoPopUp();

  return (
    <main className='h-svh flex md:grid md:grid-cols-[15rem_1fr] lg:grid-cols-[18rem_1fr] overflow-hidden'>
      <div className='hidden md:block border-r border-gray-300 dark:border-gray-600'>
        <SideBar />
      </div>

      {/* Mobile Sidebar */}
      <div className='md:hidden'>
        <SideBar />
      </div>

      <div className='relative flex-1 bg-white dark:bg-gray-900 flex flex-col overflow-hidden'>
        <LayoutDarker
          collapsed={collapsed && infoPopupCollapsed}
          onClick={toggleInfoPopup}
        />

        <div className='p-2 shrink-0'>
          <TopBar />
        </div>

        <div className='flex-1 p-2 overflow-y-auto scrollbar scrollbar-thumb-gray-600 scrollbar-track-gray-50  dark:scrollbar-thumb-gray-300 dark:scrollbar-track-gray-900'>
          <Outlet />
        </div>
      </div>
    </main>
  );
};

export default Home;
