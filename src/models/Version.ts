import type { PageRequest } from './PageRequest';
import type { User } from './User';

export type Status = 'PUBLIC' | 'PRIVATE';

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

export interface VersionRequest extends Pick<Version, 'title' | 'status'> {}
