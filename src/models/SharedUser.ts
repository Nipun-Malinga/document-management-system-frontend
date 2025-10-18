type permissions = 'READ_ONLY' | 'READ_WRITE';

interface sharedUser {
  userId: number;
  permission: permissions;
}

export interface SharedUsers {
  data: sharedUser[];
}
