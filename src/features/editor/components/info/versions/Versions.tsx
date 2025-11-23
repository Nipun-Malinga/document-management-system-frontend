import useDocumentVersions from '@/hooks/document/useDocumentVersions';
import { useParams } from 'react-router-dom';
import InfoDrawerBody from '../InfoDrawerBody';
import VersionCard from './VersionCard';
import {
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer';
import { Clock } from 'lucide-react';
import VersionCreateForm from './VersionCreateForm';

const Versions = () => {
  const { documentId } = useParams();
  const { data } = useDocumentVersions(documentId ?? '');

  return (
    <>
      <DrawerHeader className='border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'>
        <div className='flex items-center gap-3 mb-2'>
          <div className='p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
            <Clock className='w-5 h-5 text-blue-600 dark:text-blue-400' />
          </div>
          <div>
            <DrawerTitle className='text-xl font-bold text-gray-900 dark:text-gray-100'>
              Versions
            </DrawerTitle>
          </div>
        </div>
        <DrawerDescription className='text-gray-600 dark:text-gray-400'>
          Version Description
        </DrawerDescription>
      </DrawerHeader>
      <InfoDrawerBody emptyTitle='Versions' emptyDescription=''>
        <VersionCreateForm />
        {data?.data &&
          data.data.map((version) => (
            <VersionCard key={version.id} version={version} />
          ))}
      </InfoDrawerBody>
    </>
  );
};

export default Versions;
