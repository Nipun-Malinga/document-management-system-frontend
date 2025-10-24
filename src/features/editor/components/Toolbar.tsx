import React from 'react';
import { textStyleButtons } from '../data/ToolbarComponents';
import ToolButton from './ToolButton';
import { toggleMark } from '../utils';
import { useSlate } from 'slate-react';

const Toolbar = () => {
  const editor = useSlate();

  return (
    <div className='w-full border-gray-300 flex flex-col justify-center items-center gap-1'>
      <div className='flex flex-row gap-0.5'>
        {textStyleButtons.map((item, index) => (
          <ToolButton
            props={item}
            onClick={() => toggleMark(editor, item.action)}
            key={index}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(Toolbar);
