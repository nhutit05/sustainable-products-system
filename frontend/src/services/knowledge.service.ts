import type {
    KnowledgeDocument,
    KnowledgeDocumentDetail,
    KnowledgeStatistics,
    UploadResponse,
} from "../types/knowledge";

const API = "http://localhost:8080/api/admin/knowledge";

export async function uploadDocument(
    token: string,
    file: File
): Promise<UploadResponse> {

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    if (!response.ok) {
        throw new Error(await response.text());
    }

    return response.json();
}

export async function getDocuments(
    token: string
): Promise<KnowledgeDocument[]> {

    const response = await fetch(API, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(await response.text());
    }

    return response.json();
}

export async function getStatistics(
    token: string
): Promise<KnowledgeStatistics> {

    const response = await fetch(`${API}/statistics`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(await response.text());
    }

    return response.json();
}

export async function getDocument(
    token: string,
    documentId: string
): Promise<KnowledgeDocumentDetail> {

    const response = await fetch(
        `${API}/${documentId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error(await response.text());
    }

    return response.json();
}

export async function deleteDocument(
    token: string,
    documentId: string
): Promise<void> {

    const response = await fetch(
        `${API}/${documentId}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error(await response.text());
    }

}