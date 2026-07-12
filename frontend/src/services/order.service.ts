import type { CheckoutResponse } from "../model/checkout.model";

const API = "http://localhost:8080/api/orders";

export async function checkout(
    token: string,
    body: any
): Promise<CheckoutResponse> {

    const response = await fetch(`${API}/checkout`, {
        method: "POST",

        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },

        body: JSON.stringify(body),
    });

    if (!response.ok) {
        throw new Error("Checkout failed");
    }

    return response.json();
}

import type { OrderResponse } from "../model/checkout.model";

export async function getOrder(
    token: string,
    orderId: number
): Promise<OrderResponse> {

    console.log("Polling orderId:", orderId);

    const response = await fetch(
        `http://localhost:8080/api/orders/${orderId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    console.log("Status:", response.status);

    if (!response.ok) {
        console.log(await response.text());
        throw new Error("Cannot get order");
    }

    return response.json();
}