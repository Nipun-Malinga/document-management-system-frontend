import { Outlet } from 'react-router-dom';
import { SideBar, TopBar } from '../components';
import useAside from '../states/useAside';

const Home = () => {
  const { collapsed } = useAside();

  return (
    <main className='grid grid-cols-1 md:grid-cols-[18rem_1fr] md:gap-2'>
      <div className='md:p-2 border-r border-gray-300'>
        <SideBar />
      </div>

      <div className={`relative ${!collapsed && 'pointer-events-none'}`}>
        <div
          className={`absolute -z-1 w-full h-dvh ${
            !collapsed && 'z-9 inset-0 bg-black/80 transition-all duration-300'
          }`}
        ></div>
        <div className='p-2'>
          <TopBar />
        </div>
        <div className='p-2'>
          <Outlet />
        </div>
      </div>
    </main>
  );
};

export default Home;
