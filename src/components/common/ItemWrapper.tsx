import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

const ItemWrapper = ({ children, className }: Props) => {
  return (
    <div className={`bg-blue-200 p-1 rounded-md ${className}`}>{children}</div>
  );
};

export default ItemWrapper;
