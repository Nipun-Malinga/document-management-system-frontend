import type { Document, DocumentsResponse } from './Document';

export interface ShareDocumentRequest {
  userId: number;
  permission: 'READ_ONLY' | 'READ_WRITE';
}

export type SharedDocument = Document;

export type SharedDocumentsResponse = DocumentsResponse;
