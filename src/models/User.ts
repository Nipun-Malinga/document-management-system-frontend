type role = 'USER' | 'ADMIN';

export interface User {
  id: number;
  username: string;
  email: string;
  role: role;
}
