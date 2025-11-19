import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Document } from '@/models/Document';
import InfoBase from './InfoBase';
import InfoEditor from './InfoEditor';
import { Collaborators } from './collaborators';
import useInfoPopUp from '@/states/useInfoPopUp';

interface Props {
  document: Document;
}

const InfoTabs = ({ document }: Props) => {
  const { shared } = useInfoPopUp();

  return (
    <Tabs defaultValue='information'>
      <div className='bg-gray-50 dark:bg-gray-900 md:px-6 p-2 pb-2 flex justify-center md:justify-start items-center rounded-2xl'>
        <TabsList className='bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-1 rounded-lg shadow-sm space-x-1'>
          <TabsTrigger
            className='cursor-pointer data-[state=active]:bg-gray-900 data-[state=active]:text-white dark:data-[state=active]:bg-gray-100 dark:data-[state=active]:text-gray-900 data-[state=active]:shadow-sm transition-all duration-200 font-medium'
            value='information'
          >
            Information
          </TabsTrigger>
          {!shared && (
            <TabsTrigger
              className='cursor-pointer data-[state=active]:bg-gray-900 data-[state=active]:text-white dark:data-[state=active]:bg-gray-100 dark:data-[state=active]:text-gray-900 data-[state=active]:shadow-sm transition-all duration-200 font-medium'
              value='edit'
            >
              Edit
            </TabsTrigger>
          )}
          <TabsTrigger
            className='cursor-pointer data-[state=active]:bg-gray-900 data-[state=active]:text-white dark:data-[state=active]:bg-gray-100 dark:data-[state=active]:text-gray-900 data-[state=active]:shadow-sm transition-all duration-200 font-medium'
            value='Collaborators'
          >
            Collaborators
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value='information' className='mt-0'>
        <InfoBase document={document} />
      </TabsContent>
      {!shared && (
        <TabsContent value='edit' className='mt-0'>
          <InfoEditor document={document} />
        </TabsContent>
      )}
      <TabsContent value='Collaborators' className='mt-0'>
        <Collaborators documentId={document.id} />
      </TabsContent>
    </Tabs>
  );
};

export default InfoTabs;
