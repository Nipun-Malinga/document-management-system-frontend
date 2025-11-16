import { Outlet } from 'react-router-dom';

const Editor = () => {
  return (
    <div className='dark:bg-gray-900'>
      <Outlet />
    </div>
  );
};

export default Editor;
