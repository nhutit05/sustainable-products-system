export type DocumentStatus =
  | "UPLOADED"
  | "PARSED"
  | "CHUNKED"
  | "EMBEDDED"
  | "FAILED";

// export interface KnowledgeDocument {
//   id: number;

//   fileName: string;

//   fileType: string;

//   fileSize: number;

//   uploadedAt: string;

//   status: DocumentStatus;

//   chunkCount: number;

//   characterCount: number;

//   wordCount: number;

//   preview?: string;
// }

// export interface KnowledgeStatistics {
//   totalDocuments: number;

//   totalChunks: number;

//   embeddedDocuments: number;

//   failedDocuments: number;
// }

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

export interface KnowledgeStatistics {

    totalDocuments: number;

    totalChunks: number;

    embeddedDocuments: number;

    failedDocuments: number;

}

export interface KnowledgeDocument {

    documentId: string;

    fileName: string;

    documentType: "PDF" | "DOCX";

    fileSize: number;

    uploadedAt: string;

    status:
        | "UPLOADED"
        | "PARSED"
        | "CHUNKED"
        | "EMBEDDED"
        | "FAILED";

    chunkCount: number;

    characterCount: number;

    wordCount: number;

}

export interface KnowledgeDocumentDetail
    extends KnowledgeDocument {

    preview: string;

}