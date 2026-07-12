// import type { orderResponse } from './order.model'

export interface CheckoutResponse {
  order: OrderResponse
  checkoutUrl: string | null
  qrCode: string | null
  expiredAt: string | null
}

export type OrderResponse = {
  orderId: number
  orderedAt: string
  orderReceiver: string
  orderReceiverPhone: string
  orderAddress: string
  customerId: number
  customerUsername: string
  paymentMethodId: number
  paymentMethodName: string
  voucherId: number
  voucherCode: string
  orderStatusId: number
  orderStatusName: string
  paymentStatusId: number
  paymentStatusName: string
  totalAmount: number
  items: [
    {
      productId: number
      productName: string
      quantity: number
      purchasedPrice: number
      subTotal: number
    },
  ]
}

export type orderStatusResponse = {
  orderStatusId: number
  orderStatusName: string
}
