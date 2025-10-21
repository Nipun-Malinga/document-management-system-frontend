import DOMPurify from 'dompurify';
import parse from 'html-react-parser';

interface Props {
  content: string;
}

const HTMLRenderer = ({ content }: Props) => {
  const data = DOMPurify.sanitize(content);
  return <div>{parse(data)}</div>;
};

export default HTMLRenderer;
