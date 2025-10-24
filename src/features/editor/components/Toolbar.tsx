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
import { FaUndo, FaRedo } from 'react-icons/fa';

const Toolbar = () => {
  const editor = useSlate();

  return (
    <div className='w-full border-gray-300 flex flex-col justify-center items-center gap-1.5'>
      <div className='flex gap-1.5'>
        {/* Undo Redo Buttons */}
        <div className='flex'>
          <ToolButton icon={FaUndo} onClick={editor.undo} theme='common' />
          <ToolButton icon={FaRedo} onClick={editor.redo} theme='common' />
        </div>

        {/* Text Styling Options */}
        <div className='md:w-full hidden md:block'>
          <div className='flex'>fonts</div>
        </div>

        {/* Text Type Options */}
        <div className='flex gap-1.5'>
          <div className='flex'>
            {markButtons.map((item, index) => (
              <ToolButton
                icon={item.icon}
                theme={isMarkActive(editor, item.action) ? 'dark' : 'common'}
                onClick={() => toggleMark(editor, item.action)}
                key={index}
              />
            ))}
          </div>

          {/* Image And Links Options */}
          <div className='hidden md:block'>
            <div className='flex'>Image</div>
          </div>
        </div>
      </div>

      {/* Text Alignment Options */}
      <div className='flex'>
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
