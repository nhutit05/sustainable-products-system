import type {
    KnowledgeDocument,
    KnowledgeDocumentDetail,
    KnowledgeStatistics,
    UploadResponse,
} from "../types/knowledge";

import type { PageResponse } from "../types/page";

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

// export async function getDocuments(
//     token: string,
//     page: number,
//     size: number
// ): Promise<PageResponse<KnowledgeDocument>> {

//     const response = await fetch(`${API}?page=${page}&size=${size}`, {
//         headers: {
//             Authorization: `Bearer ${token}`,
//         },
//     });

//     if (!response.ok) {
//         throw new Error(await response.text());
//     }

//     return response.json();
// }

export const getDocuments = async (
    token: string,
    page: number,
    size: number,
    keyword: string,
    status: string
) => {

    const response = await fetch(`${API}?page=${page}&size=${size}&keyword=${keyword}&status=${status}`, 
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {
        throw new Error(await response.text());
    }

    return response.json();
};

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