type permission = 'UNAUTHORIZED' | 'READ_ONLY' | 'READ_WRITE' | 'ADMIN';

export interface Permission {
  userId: number;
  documentId: string;
  branchId: string;
  permission: permission;
}
