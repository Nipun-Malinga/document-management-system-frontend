import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Collaborators from './Collaborators';
import { SearchUser } from '@/features/users';
import { useShareDocument } from '@/hooks/document/collaboration';
import type { Document } from '@/models/Document';
import { useUser } from '@/hooks/user';

interface Props {
  document: Document;
}

const CollaboratorTabs = ({ document }: Props) => {
  const { mutate, isPending } = useShareDocument(document.id);
  const user = useUser();

  return (
    <Tabs defaultValue='collaborators'>
      <div className='bg-gray-50 dark:bg-gray-900 md:px-6 p-2 pb-2 flex justify-center md:justify-start items-center rounded-2xl'>
        <TabsList className='bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-1 rounded-lg shadow-sm space-x-1'>
          <TabsTrigger
            className='cursor-pointer data-[state=active]:bg-gray-900 data-[state=active]:text-white dark:data-[state=active]:bg-gray-100 dark:data-[state=active]:text-gray-900 data-[state=active]:shadow-sm transition-all duration-200 font-medium'
            value='collaborators'
          >
            Collaborators
          </TabsTrigger>

          {document.ownerId === user?.id && (
            <TabsTrigger
              className='cursor-pointer data-[state=active]:bg-gray-900 data-[state=active]:text-white dark:data-[state=active]:bg-gray-100 dark:data-[state=active]:text-gray-900 data-[state=active]:shadow-sm transition-all duration-200 font-medium'
              value='add-collaborators'
            >
              Add Collaborators
            </TabsTrigger>
          )}
        </TabsList>
      </div>

      <TabsContent value='collaborators' className='mt-0'>
        <Collaborators documentId={document.id} />
      </TabsContent>

      {document.ownerId == user?.id && (
        <TabsContent value='add-collaborators' className='mt-0'>
          <SearchUser
            onClick={(userId) =>
              mutate({
                userId: userId,
                permission: 'READ_WRITE',
              })
            }
            userPending={isPending}
            title='Add Collaborator'
            subTitle='Invite someone to collaborate'
          />
        </TabsContent>
      )}
    </Tabs>
  );
};

export default CollaboratorTabs;
