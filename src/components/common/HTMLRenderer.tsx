import DOMPurify from 'dompurify';

interface Props {
  content: string;
  editable?: boolean;
  onChange?: (content: string) => void;
}

const HTMLRenderer = ({ content, editable = false, onChange }: Props) => {
  return (
    <div
      onInput={() => console.log()}
      contentEditable={editable}
      suppressContentEditableWarning
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(content),
      }}
    />
  );
};

export default HTMLRenderer;
