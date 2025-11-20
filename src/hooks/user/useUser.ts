import { jwtDecode } from 'jwt-decode';
import type { User } from '@/models/User';

const useUser = (): User | null => {
  try {
    const token = localStorage.getItem('jwt-access-token');
    if (!token) return null;

    const payload = jwtDecode<User>(token);
    return payload;
  } catch {
    return null;
  }
};

export default useUser;
