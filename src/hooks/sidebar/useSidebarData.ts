import useDocumentCount from './useDocumentCount';
import useFavoriteCount from './useFavoriteCount';
import useSharedWithCount from './useSharedWithCount';
import useTrashAllCount from './useTrashAllCount';

interface SidebarData {
  documents: number;
  quick: number;
  resents: number;
  shared: number;
  trash: number;
}
// TODO: IMPLEMENT THE RESENTS HOOK
const useSidebarData = (): SidebarData => {
  const { data: documentCount } = useDocumentCount();
  const { data: favoriteDocumentCount } = useFavoriteCount();
  const { data: sharedWithCount } = useSharedWithCount();
  const allTrashCount = useTrashAllCount();

  return {
    documents: documentCount?.count ?? 0,
    quick: favoriteDocumentCount?.count ?? 0,
    resents: 0,
    shared: sharedWithCount?.count ?? 0,
    trash: allTrashCount,
  };
};

export default useSidebarData;
