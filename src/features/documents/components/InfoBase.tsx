import type { Document } from '@/models/Document';

interface Props {
  document: Document;
}

const InfoBase = ({ document }: Props) => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm'>
      <div className='flex flex-col gap-1 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700'>
        <span className='font-semibold text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wide'>
          Created
        </span>
        <span className='text-gray-900 dark:text-gray-100 font-medium'>
          {document.createdAt}
        </span>
      </div>
      <div className='flex flex-col gap-1 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700'>
        <span className='font-semibold text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wide'>
          Updated
        </span>
        <span className='text-gray-900 dark:text-gray-100 font-medium'>
          {document.updatedAt}
        </span>
      </div>
    </div>
  );
};

export default InfoBase;
