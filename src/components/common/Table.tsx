import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  titles: string[];
}

const Table = ({ children, titles }: Props) => {
  return (
    <table className='w-full'>
      <thead className='bg-gray-50 border-b border-gray-200'>
        <tr className='w-full'>
          {titles.map((title, index) => (
            <th
              key={index}
              className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                titles.length - 1 === index ? 'text-end' : 'text-left'
              }`}
            >
              {title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className='bg-white divide-y divide-gray-200'>{children}</tbody>
    </table>
  );
};

export default Table;
