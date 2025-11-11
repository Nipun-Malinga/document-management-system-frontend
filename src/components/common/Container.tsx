import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const Container = ({ children }: Props) => {
  return <div className='w-full'>{children}</div>;
};

export default Container;
