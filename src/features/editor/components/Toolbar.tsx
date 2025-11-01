import React from 'react';
import ToolButton from './ToolButton';
import { FaRedo, FaUndo } from 'react-icons/fa';
import {
  FaAlignCenter,
  FaAlignJustify,
  FaAlignLeft,
  FaAlignRight,
  FaBold,
  FaImage,
  FaItalic,
  FaLink,
  FaSellcast,
  FaStrikethrough,
  FaUnderline,
} from 'react-icons/fa6';
import { MdOutlineFormatColorText } from 'react-icons/md';

const Toolbar = () => {
  return (
    <div className='w-full shadow-sm p-2 flex flex-col items-center gap-2'>
      {/* Top toolbar */}
      <div className='flex flex-row md:flex-col justify-center items-center gap-2 w-full'>
        <div className='flex gap-1'>
          {/* Undo / Redo */}
          <div className='flex items-center gap-1 pr-2 border-r border-gray-300'>
            <ToolButton icon={FaUndo} theme='neutral' onClick={() => {}} />
            <ToolButton icon={FaRedo} theme='neutral' onClick={() => {}} />
          </div>

          {/* Font Options */}
          <div className='hidden md:flex items-center gap-2 px-2'>
            <span className='text-sm text-gray-600 font-medium'>Font</span>
            <div className='flex gap-1'>
              {/* You can replace this later with a dropdown or select */}
              <ToolButton
                icon={FaSellcast}
                theme='neutral'
                onClick={() => {}}
              />
            </div>
          </div>
        </div>

        <div className='flex gap-2'>
          {/* Text Style Options */}
          <div className='flex items-center gap-1 pr-2 md:border-r border-gray-300'>
            <ToolButton icon={FaBold} theme='neutral' onClick={() => {}} />
            <ToolButton icon={FaItalic} theme='neutral' onClick={() => {}} />
            <ToolButton icon={FaUnderline} theme='neutral' onClick={() => {}} />
            <ToolButton
              icon={FaStrikethrough}
              theme='neutral'
              onClick={() => {}}
            />
            <ToolButton
              icon={MdOutlineFormatColorText}
              theme='neutral'
              onClick={() => {}}
            />
          </div>

          {/* Image and Link Options */}
          <div className='hidden md:flex items-center gap-1'>
            <ToolButton icon={FaImage} theme='neutral' onClick={() => {}} />
            <ToolButton icon={FaLink} theme='neutral' onClick={() => {}} />
          </div>
        </div>
      </div>

      {/* Alignment Options */}
      <div className='flex justify-center gap-1 pt-1 w-full'>
        <ToolButton icon={FaAlignLeft} theme='neutral' onClick={() => {}} />
        <ToolButton icon={FaAlignCenter} theme='neutral' onClick={() => {}} />
        <ToolButton icon={FaAlignRight} theme='neutral' onClick={() => {}} />
        <ToolButton icon={FaAlignJustify} theme='neutral' onClick={() => {}} />
      </div>
    </div>
  );
};

export default React.memo(Toolbar);
