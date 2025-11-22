import type { PageRequest } from './PageRequest';
import type { User } from './User';

type Status = 'PUBLIC' | 'PRIVATE';

export interface Version {
  id: string;
  branchId: string;
  documentId: string;
  createdBy: User;
  title: string;
  status: Status;
  created_at: string;
}

export interface VersionResponse extends PageRequest<Version> {}
