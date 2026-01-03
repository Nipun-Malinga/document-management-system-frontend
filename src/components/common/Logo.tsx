import { useNavigate } from 'react-router-dom';

const Logo = () => {
  const navigate = useNavigate();

  return (
    <div className='relative text-xl md:text-3xl mb-2 flex flex-row items-center gap-3'>
      <div className='relative'>
        <div className='absolute inset-0 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg w-8 h-8 md:w-10 md:h-10 opacity-20 blur-sm'></div>
        <div className='relative bg-linear-to-br from-blue-500 to-blue-600 rounded-lg p-1.5 md:p-2'>
          <svg
            className='w-5 h-5 md:w-6 md:h-6 text-white'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z'
            />
          </svg>
        </div>
      </div>

      <h1
        className='font-bold cursor-pointer bg-linear-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent hover:from-blue-700 hover:to-blue-900 transition-all'
        onClick={() => navigate('/dashboard/home')}
      >
        FlowDocs
      </h1>
    </div>
  );
};

export default Logo;
