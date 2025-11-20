import { Breadcrumb, Container } from '@/components';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { quickAccessBreadcrumb } from '@/data/breadcrumb/HomeBreadcrumbs';
import { useUserDocuments } from '@/hooks/document';
import { BookmarkCheck } from 'lucide-react';
import DocumentCard from '../components/DocumentCard';
import DocumentGrid from '../components/DocumentGrid';

const Quick = () => {
  const { data } = useUserDocuments();

  const favorites = data?.data
    ? data?.data.filter((data) => data.favorite)
    : [];

  const hasFavorites = favorites.length > 0;

  return (
    <Container>
      <Breadcrumb links={quickAccessBreadcrumb} />

      {hasFavorites ? (
        <DocumentGrid>
          {favorites.map((document, index) => (
            <DocumentCard document={document} shared={false} key={index} />
          ))}
        </DocumentGrid>
      ) : (
        <Empty className='mt-20'>
          <EmptyHeader>
            <EmptyMedia variant='icon'>
              <BookmarkCheck />
            </EmptyMedia>
            <EmptyTitle>No Favorites Yet.</EmptyTitle>
            <EmptyDescription>
              You don't have any favorites yet.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </Container>
  );
};

export default Quick;
