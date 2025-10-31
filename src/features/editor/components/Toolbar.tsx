import React from 'react';

const Toolbar = () => {
  return (
    <div className='w-full border-gray-300 flex flex-col justify-center items-center gap-1.5'>
      <div className='flex gap-1.5'>
        {/* Undo Redo Buttons */}
        <div className='flex'></div>

        {/* Text Styling Options */}
        <div className='md:w-full hidden md:block'>
          <div className='flex'>fonts</div>
        </div>

        {/* Text Type Options */}
        <div className='flex gap-1.5'>
          <div className='flex'></div>

          {/* Image And Links Options */}
          <div className='hidden md:block'>
            <div className='flex'>Image</div>
          </div>
        </div>
      </div>

      {/* Text Alignment Options */}
      <div className='flex'></div>
    </div>
  );
};

export default React.memo(Toolbar);
