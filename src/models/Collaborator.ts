type permissions = 'READ_ONLY' | 'READ_WRITE';

interface Collaborator {
  userId: number;
  username: string;
  email: string;
  permission: permissions;
}

export interface CollaboratorsResponse {
  data: Collaborator[];
}
