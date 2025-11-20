import { getAccessToken } from '@/utils/authUtils';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  children: ReactNode;
}

const SecureRoute = ({ children }: Props) => {
  const token = getAccessToken();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/', { replace: true });
    }
  }, [token, navigate]);

  if (!token) return null;

  return <>{children}</>;
};

export default SecureRoute;
