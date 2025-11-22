import { DrawerContent } from '@/components';
import { useBranches } from '@/hooks/document';
import { useParams } from 'react-router-dom';
import InfoDrawerBody from '../InfoDrawerBody';
import BranchCard from './BranchCard';
import useCreateBranch from '@/hooks/document/useCreateBranch';

const Branches = () => {
  const { documentId, branchId } = useParams();
  const { data } = useBranches(documentId ?? '');

  return (
    <DrawerContent
      title='Branches'
      description='View and switch branches of your document.'
    >
      <InfoDrawerBody
        emptyTitle='Branches'
        emptyDescription=''
        buttonTitle='Create Branch'
      >
        {data?.data &&
          data.data
            .filter((branch) => !branch.trashed)
            .map((branch) => <BranchCard branch={branch} key={branch.id} />)}
      </InfoDrawerBody>
    </DrawerContent>
  );
};

export default Branches;
