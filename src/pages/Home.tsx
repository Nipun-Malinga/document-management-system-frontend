import { Outlet } from 'react-router-dom';
import { LayoutDarker, SideBar, TopBar } from '../components';
import useAside from '../states/useAside';

const Home = () => {
  const { collapsed } = useAside();

  return (
    <main className='h-svh grid grid-cols-1 md:grid-cols-[18rem_1fr] overflow-hidden'>
      <div className='border-r border-gray-300'>
        <SideBar />
      </div>

      <div className='relative p-2 flex flex-col gap-2 items-center'>
        <LayoutDarker collapsed={collapsed} zIndex={10}  />
        <TopBar />
        <Outlet />
      </div>
    </main>
  );
};

export default Home;
