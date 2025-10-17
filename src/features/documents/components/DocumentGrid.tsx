import documents from '../../../data/Documents';
import DocumentCard from './DocumentCard';

const DocumentGrid = () => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 md:gap-2'>
      {documents.map((doc) => (
        <DocumentCard
          title={doc.title}
          state={doc.status}
          createdDate={doc.createdAt}
          updatedDate={doc.updatedAt}
          key={doc.id}
        />
      ))}
    </div>
  );
};

export default DocumentGrid;
