import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Branches } from './branches';
import { Versions } from './versions';

const InfoTabs = () => {
  return (
    <Tabs defaultValue='branches'>
      <div className='bg-gray-50 dark:bg-gray-900 md:px-6 p-2 pb-2 flex justify-center md:justify-start items-center rounded-2xl'>
        <TabsList className='bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-1 rounded-lg shadow-sm space-x-1'>
          <TabsTrigger
            className='cursor-pointer data-[state=active]:bg-gray-900 data-[state=active]:text-white dark:data-[state=active]:bg-gray-100 dark:data-[state=active]:text-gray-900 data-[state=active]:shadow-sm transition-all duration-200 font-medium'
            value='branches'
          >
            Branches
          </TabsTrigger>
          <TabsTrigger
            className='cursor-pointer data-[state=active]:bg-gray-900 data-[state=active]:text-white dark:data-[state=active]:bg-gray-100 dark:data-[state=active]:text-gray-900 data-[state=active]:shadow-sm transition-all duration-200 font-medium'
            value='versions'
          >
            Versions
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value='branches' className='mt-0'>
        <Branches />
      </TabsContent>

      <TabsContent value='versions' className='mt-0'>
        <Versions />
      </TabsContent>
    </Tabs>
  );
};

export default InfoTabs;
