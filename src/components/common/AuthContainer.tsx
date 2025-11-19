import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const AuthContainer = ({ children }: Props) => {
  return <div>{children}</div>;
};

export default AuthContainer;
