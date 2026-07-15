export interface RefundSlipResponse {
    refundSlipId: number;

    bankNumber: string;

    accountBankName: string;

    reason: string;

    orderId: number;

    bankId: string;

    bankName: string;

    refundStatusId: number;

    refundStatusName: "PENDING" | "APPROVED" | "REJECTED" | "REFUNDED";

    createdAt: string;

    updatedAt: string;
}