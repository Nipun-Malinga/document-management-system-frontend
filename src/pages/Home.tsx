import { Outlet } from 'react-router-dom';
import { LayoutDarker, SideBar, TopBar } from '@/components';
import useAside from '@/states/useAside';
import useInfoPopUp from '@/states/useInfoPopUp';

const Home = () => {
  const { collapsed } = useAside();
  const { collapsed: infoPopupCollapsed, toggle: toggleInfoPopup } =
    useInfoPopUp();

  return (
    <main className='h-svh flex md:grid md:grid-cols-[15rem_1fr] lg:grid-cols-[18rem_1fr] overflow-hidden bg-gray-50 dark:bg-gray-950'>
      <div className='hidden md:block border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm'>
        <SideBar />
      </div>

      {/* Mobile Sidebar */}
      <div className='md:hidden'>
        <SideBar />
      </div>

      <div className='relative flex-1 bg-gray-50 dark:bg-gray-950 flex flex-col overflow-hidden'>
        <LayoutDarker
          collapsed={collapsed && infoPopupCollapsed}
          onClick={() => !infoPopupCollapsed && toggleInfoPopup()}
        />

        <div className='p-4 shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm'>
          <TopBar />
        </div>

        <div className='flex-1 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500 scrollbar-track-transparent dark:scrollbar-thumb-gray-600 dark:hover:scrollbar-thumb-gray-500'>
          <Outlet />
        </div>
      </div>
    </main>
  );
};

export default Home;
