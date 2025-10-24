import React from 'react';
import { useSlate } from 'slate-react';
import { alignButtons, markButtons } from '../data/ToolbarComponents';
import {
  isElementActive,
  isMarkActive,
  toggleElement,
  toggleMark,
} from '../utils';
import ToolButton from './ToolButton';

const Toolbar = () => {
  const editor = useSlate();

  return (
    <div className='w-full border-gray-300 flex flex-col justify-center items-center gap-1'>
      <div className='flex flex-row gap-0.5'>
        {markButtons.map((item, index) => (
          <ToolButton
            icon={item.icon}
            theme={isMarkActive(editor, item.action) ? 'dark' : 'common'}
            onClick={() => toggleMark(editor, item.action)}
            key={index}
          />
        ))}
      </div>
      <div className='flex flex-row gap-0.5'>
        {alignButtons.map((item, index) => (
          <ToolButton
            icon={item.icon}
            theme={isElementActive(editor, item.action) ? 'dark' : 'common'}
            onClick={() => toggleElement(editor, item.action)}
            key={index}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(Toolbar);
