import type { SidebarData } from '@/models/SidebarData';
import useRecentDocuments from '../document/useRecentDocuments';
import useDocumentCount from './useDocumentCount';
import useFavoriteCount from './useFavoriteCount';
import useSharedWithCount from './useSharedWithCount';
import useTrashAllCount from './useTrashAllCount';

const useSidebarData = (): SidebarData => {
  const documents = useDocumentCount();
  const favorites = useFavoriteCount();
  const shared = useSharedWithCount();
  const recent = useRecentDocuments();
  const allTrashCount = useTrashAllCount();

  return {
    documents: documents.isError ? null : documents.data?.count ?? null,
    quick: favorites.isError ? null : favorites.data?.count ?? null,
    resents: recent.isError ? null : recent.data?.totalElements ?? null,
    shared: shared.isError ? null : shared.data?.count ?? null,
    trash: allTrashCount,
  };
};

export default useSidebarData;
