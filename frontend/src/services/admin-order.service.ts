import axios from "axios";

import type {
  PageResponse,
  orderStatusResponse,
  orderSummaryResponse,
  paymentMethodResponse,
  paymentStatusResponse,
} from "../model/order.model";

const API_URL = "http://localhost:8080/api/admin/orders";

export interface GetOrdersParams {
  page: number;
  size: number;

  keyword?: string;

  orderStatusId?: number;

  paymentStatusId?: number;

  paymentMethodId?: number;

  startDate?: string,

  endDate?: string
}

export async function getOrders(
  token: string,
  params: GetOrdersParams
): Promise<PageResponse<orderSummaryResponse>> {

  const response = await axios.get<
    PageResponse<orderSummaryResponse>
  >(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },

    params: {
      page: params.page,
      size: params.size,

      keyword: params.keyword || undefined,

      orderStatusId:
        params.orderStatusId || undefined,

      paymentStatusId:
        params.paymentStatusId || undefined,

      paymentMethodId:
        params.paymentMethodId || undefined,

        startDate: params.startDate || undefined,
        endDate: params.endDate || undefined
    },
  });

  return response.data;
}

const ADMIN_API = "http://localhost:8080/api/admin";

export async function getOrderStatuses(
    token: string
): Promise<orderStatusResponse[]> {

    const response = await axios.get(
        `${ADMIN_API}/order-statuses`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
}

export async function getPaymentStatuses(
    token: string
): Promise<paymentStatusResponse[]> {

    const response = await axios.get(
        `${ADMIN_API}/payment-statuses`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
}

export async function getPaymentMethods(
    token: string
): Promise<paymentMethodResponse[]> {

    const response = await axios.get(
        `${ADMIN_API}/payment-methods`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
}


const API = "http://localhost:8080/api/admin/orders";

export const getOrderById = async (
    token: string,
    orderId: number
) => {

    const response = await axios.get(
        `${API}/${orderId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export const confirmOrder = async (
    token: string,
    orderId: number
) => {

    const response = await axios.put(
        `${API}/${orderId}/confirm`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export const shippingOrder = async (
    token: string,
    orderId: number
) => {

    const response = await axios.put(
        `${API}/${orderId}/shipping`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export const completeOrder = async (
    token: string,
    orderId: number
) => {

    const response = await axios.put(
        `${API}/${orderId}/complete`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export const rejectOrder = async (
    token: string,
    orderId: number
) => {

    const response = await axios.put(
        `${API}/${orderId}/reject`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};