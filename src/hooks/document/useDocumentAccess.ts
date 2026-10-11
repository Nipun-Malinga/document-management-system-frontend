import { useUser } from '@/hooks/user';
import useDocument from './useDocument';
import { useValidatePermissions } from './collaboration';

// Mutations fail closed while access is being checked or after a failed check.
// Never authorize using a response for a different user/document/branch.
const useDocumentAccess = (documentId: string, branchId: string) => {
  const user = useUser();
  const document = useDocument(documentId);
  const permissions = useValidatePermissions(documentId, branchId);
  const permission = permissions.data;
  const valid = Boolean(
    user && documentId && branchId &&
    permission?.userId === user.id &&
    permission.documentId === documentId && permission.branchId === branchId &&
    !permissions.isError
  );
  const canRead = valid && (
    permission?.permission === 'READ_ONLY' ||
    permission?.permission === 'READ_WRITE' ||
    permission?.permission === 'ADMIN'
  );
  const canWrite = canRead && !permissions.isFetching && (
    permission?.permission === 'READ_WRITE' || permission?.permission === 'ADMIN'
  );

  return {
    canRead,
    canWrite,
    isOwner: Boolean(
      canRead && !permissions.isFetching && user && !document.isError && !document.isFetching &&
      document.data?.id === documentId && document.data.ownerId === user.id
    ),
    isPending: permissions.isPending,
    isError: permissions.isError,
  };
};

export default useDocumentAccess;
