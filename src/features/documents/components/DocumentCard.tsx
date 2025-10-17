import { LuFileText } from 'react-icons/lu';
import { HiDotsVertical } from 'react-icons/hi';
import { Badge, Button } from '../../../components';

interface Props {
  title: string;
  state: string;
  createdDate: string;
  updatedDate: string;
}

const DocumentCard = ({ title, state, createdDate, updatedDate }: Props) => {
  return (
    <div className='group w-full min-h-[16rem] p-2.5 border border-gray-200 rounded-lg flex flex-col justify-around transition-all duration-200 ease-in-out hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)]'>
      <div className='relative bg-blue-50 w-full min-h-[10rem] rounded-md cursor-pointer flex justify-center items-center'>
        <div className='absolute top-2 right-2 opacity-0 transition group-hover:opacity-100'>
          <Button icon={HiDotsVertical} type='button' onClick={() => {}} />
        </div>
        <LuFileText className='text-8xl md:text-6xl text-blue-600' />
        <div className='absolute bottom-2 right-2'>
          <Badge
            text={state}
            theme={state.toLowerCase() == 'public' ? 'primary' : 'secondary'}
          />
        </div>
      </div>
      <div className='flex flex-col justify-center'>
        <p className='text-xl md:text-lg lg:text-sm capitalize font-medium'>
          {title}
        </p>
        <div className='flex justify-between'>
          <p className='text-sm md:text-xs text-gray-500'>
            Created: {createdDate}
          </p>
          <p className='text-sm md:text-xs text-gray-500'>
            Updated: {updatedDate}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
