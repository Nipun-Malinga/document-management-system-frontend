import { Outlet } from 'react-router-dom';

const Editor = () => {
  return (
    <div className='bg-gray-50 dark:bg-gray-950 w-screen h-screen overflow-hidden'>
      <Outlet />
    </div>
  );
};

export default Editor;