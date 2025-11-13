import useTrashBranchCount from './useTrashBranchCount';
import useTrashDocumentCount from './useTrashDocumentCount';

const useTrashAllCount = (): number => {
  const { data: trashBranchCount } = useTrashBranchCount();
  const { data: trashDocumentCount } = useTrashDocumentCount();

  return (trashBranchCount?.count ?? 0) + (trashDocumentCount?.count ?? 0);
};

export default useTrashAllCount;
