import { useUser } from '@/hooks/user';
import { getAccessToken } from '@/utils/authUtils';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  children: ReactNode;
  navigation?: string;
  type?: 'ADMIN' | 'USER';
}

const SecureRoute = ({ children, navigation, type = 'USER' }: Props) => {
  const token = getAccessToken();
  const navigate = useNavigate();
  const user = useUser();

  useEffect(() => {
    if (type === 'ADMIN') {
      if (!token && (!user || user.role !== 'ADMIN')) {
        navigate(navigation || '/admin/auth/signin');
      }
    } else {
      if (!token && !user) {
        navigate(navigation || '/auth/signin');
      }
    }
  }, [token, navigate]);

  if (!token) return null;

  return <>{children}</>;
};

export default SecureRoute;
