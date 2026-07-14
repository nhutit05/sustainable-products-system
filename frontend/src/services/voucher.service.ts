import type {
    VoucherQuery,
    VoucherRequest,
    VoucherResponse,
    VoucherSummary,
    VoucherPatchRequest
} from "../model/voucher.model";
import type { PageResponse } from "../model/page.model";

const API_URL = "http://localhost:8080/api";

function buildQuery(query: VoucherQuery): string {
    const params = new URLSearchParams();

    params.append("page", query.page.toString());
    params.append("size", query.size.toString());

    if (query.keyword?.trim()) {
        params.append("keyword", query.keyword.trim());
    }

    if (query.active !== undefined) {
        params.append("active", query.active.toString());
    }

    if (query.sortBy) {
        params.append("sortBy", query.sortBy);
    }

    if (query.direction) {
        params.append("direction", query.direction);
    }

    return params.toString();
}

function getHeaders(): HeadersInit {
    const token = localStorage.getItem("token");

    return {
        "Content-Type": "application/json",
        ...(token && {
            Authorization: `Bearer ${token}`,
        }),
    };
}

export async function getAllForAdmin(
    query: VoucherQuery
): Promise<PageResponse<VoucherSummary>> {

    const response = await fetch(
        `${API_URL}/admin/vouchers?${buildQuery(query)}`,
        {
            method: "GET",
            headers: getHeaders(),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to load vouchers.");
    }

    return response.json();
}

export async function getById(
    id: number
): Promise<VoucherResponse> {

    const response = await fetch(
        `${API_URL}/admin/vouchers/${id}`,
        {
            method: "GET",
            headers: getHeaders(),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to load voucher.");
    }

    return response.json();
}

export async function createVoucher(
    request: VoucherRequest
): Promise<VoucherResponse> {

    const response = await fetch(
        `${API_URL}/admin/vouchers`,
        {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(request),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to create voucher.");
    }

    return response.json();
}


export async function updateVoucher(
    id: number,
    request: VoucherPatchRequest
): Promise<VoucherResponse> {

    const response = await fetch(
        `${API_URL}/admin/vouchers/${id}`,
        {
            method: "PATCH",
            headers: getHeaders(),
            body: JSON.stringify(request),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to update voucher.");
    }

    return response.json();
}

export async function deleteVoucher(
    id: number
): Promise<void> {

    const response = await fetch(
        `${API_URL}/admin/vouchers/${id}`,
        {
            method: "DELETE",
            headers: getHeaders(),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to delete voucher.");
    }
}