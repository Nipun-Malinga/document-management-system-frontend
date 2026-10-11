import MergeControl from '../MergeControl';
import { Button } from '@/components';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useNavigate, useParams } from 'react-router-dom';
import useDocumentAccess from '@/hooks/document/useDocumentAccess';
import type { Version } from '@/models/Version';
import { Clock, Eye, History, User } from 'lucide-react';

interface Props {
  version: Version;
}

const VersionCard = ({ version }: Props) => {
  const { branchId } = useParams();
  const navigate = useNavigate();
  const { canWrite } = useDocumentAccess(version.documentId, branchId ?? '');

  return (
    <Card className='bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 hover:shadow-lg group'>
      {/* HEADER */}
      <CardHeader>
        <div className='flex items-start'>
          <div className='flex items-center flex-1 min-w-0'>
            <div className='p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg shrink-0'>
              <History className='w-5 h-5 text-blue-600 dark:text-blue-400' />
            </div>

            <div className='flex-1 min-w-0'>
              <div className='flex items-center gap-2 flex-wrap'>
                <CardTitle className='text-sm md:text-lg font-bold text-gray-900 dark:text-gray-100 truncate'>
                  {version.title}
                </CardTitle>

                <span
                  className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full border ${
                    version.status === 'PUBLIC'
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600'
                  }`}
                >
                  {version.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      {/* CONTENT */}
      <CardContent className='space-y-3'>
        {/* Created By */}
        <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700'>
          <User className='w-4 h-4 shrink-0' />
          <span className='text-xs'>
            Created by {version.createdBy.username}
          </span>
        </div>

        {/* Created At */}
        <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700'>
          <Clock className='w-4 h-4 shrink-0' />
          <span className='text-xs'>Created {version.createdAt}</span>
        </div>
      </CardContent>

      {/* FOOTER */}
      <CardFooter className='pt-4 border-t-2 border-gray-200 dark:border-gray-700'>
        <div className='flex flex-wrap gap-2 w-full'>
          <Button
            onClick={() => navigate(`/document/${version.documentId}/version/${version.id}/view`)}
            className='flex-1 min-w-[100px] flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-all duration-150 active:scale-95'
          >
            <Eye className='w-4 h-4' />
            Preview
          </Button>

          {/* MERGE */}
          {canWrite && <MergeControl documentId={version.documentId} targetBranchId={branchId ?? ''} source={{ kind: 'version', id: version.id, name: version.title }} />}
        </div>
      </CardFooter>
    </Card>
  );
};

export default VersionCard;
