import { FiSearch } from 'react-icons/fi';

interface Props {
  output: (value: string) => void;
}

const SearchInput = ({ output }: Props) => {
  return (
    <div className='bg-slate-200 dark:bg-slate-700 w-full max-w-xs md:max-w-xl px-2.5 py-1.5 rounded-sm flex items-center gap-x-2 border border-slate-200 dark:border-slate-700 transition duration-100 ease-in-out has-[input:focus]:shadow-[0_3px_10px_rgb(0,0,0,0.5)] has-[input:focus]:border-slate-400'>
      <FiSearch className='text-slate-400 text-xl md:text-2xl shrink-0' />
      <input
        type='text'
        placeholder='Search documents...'
        onChange={(value) => output(value.target.value)}
        className='text-sm outline-none w-full bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400'
      />
    </div>
  );
};

export default SearchInput;