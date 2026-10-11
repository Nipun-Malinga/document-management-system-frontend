import { actionError } from '@/features/editor/persistence/actionError';
import { Button } from '@/components';
import useTrashDocument from '@/hooks/document/useTrashDocument';
import useDocumentInfoPopUp from '@/states/useDocumentInfoPopup';
import { MdDeleteOutline } from 'react-icons/md';
import { useDocument } from '@/hooks/document';
import { useUser } from '@/hooks/user';

interface Props {
  documentId: string;
}

const InfoButtons = ({ documentId }: Props) => {
  const { mutateAsync, isPending, isError: mutationError, error } = useTrashDocument(documentId);
  const { toggleDocumentInfoPopup } = useDocumentInfoPopUp();
  const user = useUser();
  const { data, isError, isFetching } = useDocument(documentId);
  const isOwner = Boolean(user && !isError && !isFetching && data?.id === documentId && data.ownerId === user.id);

  if (!isOwner) return null;

  return (
    <div className='w-full flex justify-end gap-1'>
      <Button
        icon={MdDeleteOutline}
        type='button'
        title='Delete'
        disabled={isPending}
        onClick={() => {
          if (!isOwner) return;
          void mutateAsync().then(() => toggleDocumentInfoPopup()).catch(() => {});
        }}
      />
      {mutationError && <p role='alert' className='text-sm text-destructive'>{actionError(error)}</p>}
    </div>
  );
};

export default InfoButtons;
