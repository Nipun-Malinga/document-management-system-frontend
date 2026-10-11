import { jwtDecode } from 'jwt-decode';
import type { User } from '@/models/User';

export type SessionUser = Omit<User, 'firstname' | 'lastname'>;

export const parseAccessToken = (token: string | null, allowExpired = false) => {
  try {
    if (!token || token.split('.').length !== 3 || token.split('.').some((part) => !part)) return null;
    const header = jwtDecode<{ alg?: unknown }>(token, { header: true });
    if (typeof header.alg !== 'string' || !header.alg || header.alg === 'none') return null;
    const payload = jwtDecode<{ sub: string; username: string; email: string; role: User['role']; exp: number; token_type?: string }>(token);
    if (
      typeof payload.sub !== 'string' || !/^[1-9]\d*$/.test(payload.sub) ||
      !Number.isSafeInteger(Number(payload.sub)) ||
      typeof payload.username !== 'string' || !payload.username.trim() ||
      typeof payload.email !== 'string' || !payload.email.trim() ||
      (payload.role !== 'USER' && payload.role !== 'ADMIN') ||
      (payload.token_type !== undefined && payload.token_type !== 'access') ||
      typeof payload.exp !== 'number' || !Number.isFinite(payload.exp * 1000) ||
      (!allowExpired && payload.exp <= Date.now() / 1000)
    ) return null;
    const user: SessionUser = {
      id: Number(payload.sub), username: payload.username, email: payload.email, role: payload.role,
    };
    return { user, expiresAt: payload.exp * 1000 };
  } catch {
    return null;
  }
};
