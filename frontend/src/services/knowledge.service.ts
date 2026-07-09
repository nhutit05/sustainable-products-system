import api from "./api";
import type {
  DocumentQueryParams,
  KnowledgeDocument,
  KnowledgeStatistics,
  UploadResponse,
} from "../types/knowledge";

const BASE_URL = "/admin/knowledge";

export const knowledgeService = {
  /**
   * Upload tài liệu
   */
  uploadDocument: async (
    file: File
  ): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(
      `${BASE_URL}/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },

  /**
   * Lấy danh sách tài liệu
   */
  getDocuments: async (
    params?: DocumentQueryParams
  ): Promise<KnowledgeDocument[]> => {
    const response = await api.get(BASE_URL, {
      params,
    });

    return response.data;
  },

  /**
   * Lấy chi tiết tài liệu
   */
  getDocumentById: async (
    id: number
  ): Promise<KnowledgeDocument> => {
    const response = await api.get(
      `${BASE_URL}/${id}`
    );

    return response.data;
  },

  /**
   * Lấy thống kê
   */
  getStatistics:
    async (): Promise<KnowledgeStatistics> => {
      const response = await api.get(
        `${BASE_URL}/statistics`
      );

      return response.data;
    },

  /**
   * Xóa tài liệu
   */
  deleteDocument: async (
    id: number
  ): Promise<void> => {
    await api.delete(`${BASE_URL}/${id}`);
  },
};
