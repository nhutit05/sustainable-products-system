export type DocumentStatus =
  | "UPLOADED"
  | "PARSED"
  | "CHUNKED"
  | "EMBEDDED"
  | "FAILED";

export interface KnowledgeDocument {
  id: number;

  fileName: string;

  fileType: string;

  fileSize: number;

  uploadedAt: string;

  status: DocumentStatus;

  chunkCount: number;

  characterCount: number;

  wordCount: number;

  preview?: string;
}

export interface KnowledgeStatistics {
  totalDocuments: number;

  totalChunks: number;

  embeddedDocuments: number;

  failedDocuments: number;
}

export interface DocumentQueryParams {
  keyword?: string;

  status?: DocumentStatus;

  page?: number;

  size?: number;
}

export interface UploadResponse {
  documentId: number;

  message: string;
}

