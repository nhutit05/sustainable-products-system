import type {
    DocumentQueryParams,
    KnowledgeDocument,
    KnowledgeStatistics,
    UploadResponse,
} from "../types/knowledge";

const API = "http://localhost:8080/api/admin/knowledge";

/**
 * Upload tài liệu
 */
export async function uploadDocument(
    token: string,
    file: File
): Promise<UploadResponse> {

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API}/upload`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    if (!response.ok) {
        throw new Error("Upload document failed");
    }

    return response.json();
}

/**
 * Lấy danh sách tài liệu
 */
export async function getDocuments(
    token: string,
    params?: DocumentQueryParams
): Promise<KnowledgeDocument[]> {

    const query = new URLSearchParams();

    if (params?.keyword) {
        query.append("keyword", params.keyword);
    }

    if (params?.status) {
        query.append("status", params.status);
    }

    if (params?.page !== undefined) {
        query.append("page", params.page.toString());
    }

    if (params?.size !== undefined) {
        query.append("size", params.size.toString());
    }

    const response = await fetch(
        `${API}?${query.toString()}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error("Cannot get documents");
    }

    return response.json();
}

/**
 * Lấy chi tiết tài liệu
 */
export async function getDocumentById(
    token: string,
    id: number
): Promise<KnowledgeDocument> {

    const response = await fetch(`${API}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Cannot get document");
    }

    return response.json();
}

/**
 * Lấy thống kê
 */
export async function getStatistics(
    token: string
): Promise<KnowledgeStatistics> {

    const response = await fetch(`${API}/statistics`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Cannot get statistics");
    }

    return response.json();
}

/**
 * Xóa tài liệu
 */
export async function deleteDocument(
    token: string,
    id: number
): Promise<void> {

    const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Delete document failed");
    }
}