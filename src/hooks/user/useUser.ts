import { jwtDecode } from 'jwt-decode';
import type { User } from '@/models/User';

interface Token extends Omit<User, 'id'> {
  sub: string;
}

const useUser = (): Omit<User, 'firstname' | 'lastname'> | null => {
  try {
    const token = localStorage.getItem('jwt-access-token');
    if (!token) return null;

    const payload = jwtDecode<Token>(token);
    return {
      id: parseInt(payload.sub),
      username: payload.username,
      email: payload.email,
      role: payload.role,
    };
  } catch {
    return null;
  }
};

export default useUser;
