import { useUser } from '@/hooks/user';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface Props {
  children: ReactNode;
  navigation?: string;
  type?: 'ADMIN' | 'USER';
}

const SecureRoute = ({ children, navigation, type = 'USER' }: Props) => {
  const user = useUser();
  if (!user || (type === 'ADMIN' && user.role !== 'ADMIN')) {
    return (
      <Navigate
        to={navigation || (type === 'ADMIN' ? '/admin/auth/signin' : '/auth/signin')}
        replace
      />
    );
  }

  return <>{children}</>;
};

export default SecureRoute;
