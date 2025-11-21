import type { ReactNode } from 'react';

interface Props {
  collapsed: boolean;
  children: ReactNode;
}

const PopupWrapper = ({ collapsed, children }: Props) => {
  return (
    <div className='flex justify-center items-start'>
      <div
        className={`absolute z-20 top-0.5 md:top-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 w-[90vw] md:w-[70vw] lg:w-[55vw] xl:w-[65vw] p-6 rounded-2xl shadow-2xl flex flex-col gap-6 transition-all duration-300 ${
          collapsed
            ? 'opacity-0 pointer-events-none scale-95 translate-y-4'
            : 'opacity-100 scale-100 translate-y-0'
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default PopupWrapper;
