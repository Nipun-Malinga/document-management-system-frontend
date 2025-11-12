import { FiSearch } from 'react-icons/fi';

interface Props {
  output: (value: string) => void;
}

const SearchInput = ({ output }: Props) => {
  return (
    <div className='relative group w-full max-w-xs md:max-w-xl'>
      {/* Search Container */}
      <div className='relative flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-700 focus-within:border-blue-500 dark:focus-within:border-blue-600 focus-within:shadow-lg focus-within:shadow-blue-500/20 dark:focus-within:shadow-blue-500/30'>
        {/* Search Icon */}
        <FiSearch className='text-gray-400 dark:text-gray-500 text-xl shrink-0 transition-colors duration-200 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400' />

        {/* Input Field */}
        <input
          type='text'
          placeholder={''}
          onChange={(e) => output(e.target.value)}
          className='flex-1 text-sm bg-transparent text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none'
        />

        {/* Focus Ring Effect */}
        <div className='absolute inset-0 rounded-xl ring-2 ring-blue-500/0 transition-all duration-200 group-focus-within:ring-blue-500/20 pointer-events-none' />
      </div>

      {/* Subtle Bottom Gradient */}
      <div className='absolute -bottom-px left-1/2 -translate-x-1/2 w-0 h-0.5 bg-linear-to-r from-transparent via-blue-500 to-transparent transition-all duration-300 group-focus-within:w-full opacity-0 group-focus-within:opacity-100' />
    </div>
  );
};

export default SearchInput;
