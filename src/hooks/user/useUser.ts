import { jwtDecode } from 'jwt-decode';
import type { User } from '@/models/User';
import { getAccessToken } from '@/utils/authUtils';

interface Token extends Omit<User, 'id'> {
  sub: string;
  exp: number;
}

const useUser = (): Omit<User, 'firstname' | 'lastname'> | null => {
  try {
    const token = getAccessToken();
    if (!token || token.split('.').length !== 3 || token.split('.').some((part) => !part)) return null;

    const header = jwtDecode<{ alg?: unknown }>(token, { header: true });
    if (typeof header.alg !== 'string' || !header.alg || header.alg === 'none') return null;

    const payload = jwtDecode<Token>(token);
    if (
      typeof payload.sub !== 'string' ||
      !/^[1-9]\d*$/.test(payload.sub) ||
      !Number.isSafeInteger(Number(payload.sub)) ||
      typeof payload.username !== 'string' ||
      !payload.username.trim() ||
      typeof payload.email !== 'string' ||
      !payload.email.trim() ||
      (payload.role !== 'USER' && payload.role !== 'ADMIN') ||
      typeof payload.exp !== 'number' ||
      !Number.isFinite(payload.exp) ||
      payload.exp <= Date.now() / 1000
    ) {
      return null;
    }

    return {
      id: Number(payload.sub),
      username: payload.username,
      email: payload.email,
      role: payload.role,
    };
  } catch {
    return null;
  }
};

export default useUser;
