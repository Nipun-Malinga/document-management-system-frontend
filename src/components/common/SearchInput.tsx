import { FiSearch } from 'react-icons/fi';

interface Props {
  output: (value: string) => void;
}

const SearchInput = ({ output }: Props) => {
  return (
    <div className='bg-gray-200 max-w-xs md:max-w-xl px-2.5 py-1.5 rounded-sm flex items-center gap-x-2 border border-gray-200 transition duration-100 ease-in-out has-[input:focus]:shadow-[0_3px_10px_rgb(0,0,0,0.5)] has-[input:focus]:border-gray-400'>
      <FiSearch className=' text-gray-400 text-xl md:text-2xl justify-self-start ' />
      <input
        type='text'
        placeholder='Search documents...'
        onChange={(value) => output(value.target.value)}
        className='text-sm outline-none w-full md:pt-0.5 flex justify-center basis-full'
      />
    </div>
  );
};

export default SearchInput;
