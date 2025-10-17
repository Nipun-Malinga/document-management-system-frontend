import { Outlet } from 'react-router-dom';
import { SideBar, TopBar } from '../components';

const Home = () => {
  return (
    <main className='grid grid-cols-1 md:grid-cols-[18rem_1fr] md:gap-2'>
      <div className='md:p-2 border-r border-gray-300'>
        <SideBar />
      </div>

      <div>
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
