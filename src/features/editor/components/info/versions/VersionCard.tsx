import { Button } from '@/components';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useMergeVersion } from '@/hooks/document';
import type { Version } from '@/models/Version';
import { CheckCircle, Clock, Eye, User } from 'lucide-react';

interface Props {
  version: Version;
}

const VersionCard = ({ version }: Props) => {
  const { mutate, isPending } = useMergeVersion(
    version.documentId,
    version.branchId,
    version.id
  );

  return (
    <Card className='gap-2 m-5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 hover:shadow-lg group'>
      <CardHeader>
        <div className='flex items-start justify-between gap-3'>
          <div className='flex-1 min-w-0'>
            <div className='flex items-center gap-2 mb-2'>
              <CardTitle className='text-lg font-bold text-gray-900 dark:text-gray-100 truncate'>
                {version.title}
              </CardTitle>
            </div>
            <CardDescription className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'>
              <User className='w-4 h-4' />
              {version.createdBy.username}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className='flex flex-col justify-between'>
          {/* Status Badge */}
          <div className='flex items-center gap-2 py-2'>
            <span className='text-xs font-medium text-gray-500 dark:text-gray-400'>
              Status:
            </span>
            <span
              className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${
                version.status === 'PUBLIC'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
              }`}
            >
              {version.status}
            </span>
          </div>

          {/* Created Date */}
          <div className='flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400'>
            <Clock className='w-4 h-4' />
            <span>{version.created_at}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className='pt-3 border-t border-gray-200 dark:border-gray-700'>
        <div className='flex flex-col md:flex-row gap-2 w-full'>
          <Button onClick={() => {}}>
            <Eye className='w-4 h-4' />
            Preview
          </Button>
          <Button onClick={() => mutate()} disabled={isPending}>
            <CheckCircle className='w-4 h-4' />
            Merge
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default VersionCard;
