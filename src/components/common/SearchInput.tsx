import { FiSearch } from 'react-icons/fi';

interface Props {
  output: (value: string) => void;
}

const SearchInput = ({ output }: Props) => {
  return (
    <div className='bg-gray-300 dark:bg-gray-600 w-full max-w-xs md:max-w-xl px-2.5 py-1.5 rounded-sm flex items-center gap-x-2 border border-gray-200 dark:border-gray-700 transition duration-100 ease-in-out has-[input:focus]:shadow-[0_3px_10px_rgb(0,0,0,0.5)] has-[input:focus]:border-gray-400'>
      <FiSearch className='text-gray-300 text-xl md:text-2xl shrink-0' />
      <input
        type='text'
        placeholder='Search documents...'
        onChange={(value) => output(value.target.value)}
        className='text-sm outline-none w-full bg-transparent text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400'
      />
    </div>
  );
};

export default SearchInput;