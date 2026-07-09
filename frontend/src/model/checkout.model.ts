import type { OrderResponse } from "./order.model";

export interface CheckoutResponse {
    order: OrderResponse;
    checkoutUrl: string | null;
    qrCode: string | null;
    expiredAt: string | null;
}