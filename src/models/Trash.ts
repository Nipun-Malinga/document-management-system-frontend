import type { PageRequest } from './PageRequest';
import type { Document } from './Document';
import type { Branch } from './Branch';

interface Trash {
  id: number;
  addedDate: string;
}

export interface TrashDocument extends Trash {
  document: Document;
}

export interface TrashBranch extends Trash {
  branch: Branch;
}

export interface TrashDocumentResponse extends PageRequest<TrashDocument> {}

export interface TrashBranchResponse extends PageRequest<TrashBranch> {}
