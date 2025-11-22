type role = 'USER' | 'ADMIN';

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  role: role;
}
