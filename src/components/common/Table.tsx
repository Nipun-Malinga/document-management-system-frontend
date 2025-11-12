import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  titles: string[];
}

const Table = ({ children, titles }: Props) => {
  return (
    <div className='overflow-hidden'>
      <table className='w-full'>
        <thead className='bg-gray-50 dark:bg-gray-900'>
          <tr className='w-full'>
            {titles.map((title, index) => (
              <th
                key={index}
                className={`px-6 py-4 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide ${
                  titles.length - 1 === index ? 'text-end' : 'text-left'
                }`}
              >
                {title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700'>
          {children}
        </tbody>
      </table>
    </div>
  );
};

export default Table;