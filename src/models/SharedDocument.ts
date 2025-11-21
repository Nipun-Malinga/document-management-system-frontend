import type { Document, DocumentsResponse } from './Document';

export interface ShareDocumentRequest {
  userId: number;
  permission: 'READ_ONLY' | 'READ_WRITE';
}

export interface SharedDocument extends Document {}

export interface SharedDocumentsResponse extends DocumentsResponse {}
