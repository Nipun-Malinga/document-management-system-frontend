import type { Document } from '@/models/Document';
import type { Permission } from '@/models/Permission';

export const claims = {
  sub: '1', username: 'owner', email: 'owner@example.com', role: 'USER',
  exp: Math.floor(Date.now() / 1000) + 3600,
};

export const tokenFor = (payload: Record<string, unknown> = claims) =>
  `${btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))}.${btoa(JSON.stringify(payload))}.signature`;

export const document: Document = {
  id: 'doc', title: 'Document', ownerId: 1, status: 'PRIVATE', shared: false,
  mainBranchId: 'main', branchCount: 2, createdAt: '2026-10-11',
  updatedAt: '2026-10-11', trashed: false, favorite: false,
};

export const permission: Permission = {
  userId: 1, documentId: 'doc', branchId: 'main', permission: 'READ_WRITE',
};
