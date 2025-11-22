import { Button } from '@/components';
import FormButton from '@/components/common/Buttons/FormButton';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useTrashBranch } from '@/hooks/document';
import type { Branch } from '@/models/Branch';
import { Clock } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

interface Props {
  branch: Branch;
}

const BranchCard = ({ branch }: Props) => {
  const { branchId } = useParams();
  const { mutate, isPending } = useTrashBranch(branch.documentId, branch.id);

  return (
    <Card className='gap-2 m-5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 hover:shadow-lg group'>
      <CardHeader>
        <div className='flex items-start justify-between gap-3'>
          <div className='flex-1 min-w-0'>
            <div className='flex items-center gap-2 mb-2'>
              <CardTitle className='text-lg font-bold text-gray-900 dark:text-gray-100 truncate'>
                {branch.branchName}
              </CardTitle>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className='flex flex-col md:flex-row justify-between'>
          {/* Created Date */}
          <div className='flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400'>
            <Clock className='w-4 h-4' />
            <span>{branch.createdAt}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className='pt-3 border-t border-gray-200 dark:border-gray-700'>
        <div className='flex flex-col md:flex-row w-full'>
          <Button onClick={() => {}}>Preview</Button>
          <Button disabled={branch.id === branchId}>
            <Link
              to={`/document/${branch.documentId}/branch/${branch.id}/edit`}
              target='_blank'
              rel='noopener noreferrer'
              className='flex gap-2'
            >
              Switch
            </Link>
          </Button>
          <FormButton
            isPending={isPending}
            isValid={true}
            title='Delete'
            pendingTitle='Deleting'
            disabled={branch.branchName.toLowerCase() === 'main'}
            onClick={() => mutate()}
          />
        </div>
      </CardFooter>
    </Card>
  );
};

export default BranchCard;
