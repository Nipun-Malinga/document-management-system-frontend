import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const EditorContainer = ({ children }: Props) => {
  return <div className='p-1 md:p-2'>{children}</div>;
};

export default EditorContainer;
