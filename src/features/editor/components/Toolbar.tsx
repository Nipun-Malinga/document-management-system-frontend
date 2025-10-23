import React from 'react';
import { alignmentButtons, textStyleButtons } from '../data/ToolbarComponents';
import ToolButton from './ToolButton';

const Toolbar = () => {
  return (
    <div className='w-full flex flex-col justify-center items-center gap-0.5'>
      <div className='w-full flex flex-row justify-center gap-5'>
        <div className='flex flex-row gap-0.5'>
          {textStyleButtons.map((item, index) => (
            <ToolButton props={item} key={index} />
          ))}
        </div>
      </div>
      <div className='flex flex-row gap-0.5'>
        {alignmentButtons.map((item, index) => (
          <ToolButton props={item} key={index} />
        ))}
      </div>
    </div>
  );
};

export default React.memo(Toolbar);
