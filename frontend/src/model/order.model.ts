// ================ ORDER STATUS ===============

export type orderStatusResponse = {
  orderStatusId: number
  orderStatusName: string
}

// ================ ORDER ===============

export type orderResponse = {
  orderId: number
  orderedAt: string

  orderReceiver: string
  orderRecieverPhone: string

  customerId: number
  customerName: string

  paymentMethodId: number
  paymentMethodName: string

  voucherId: number | null
  voucherCode: string | null

  orderStatusId: number
  orderStatusName: string

  totalAmount: number

  items: orderItemResponse[]
}

export type orderRequest = {
  orderReceiver: string
  orderReceiverPhone: string
  paymentMethodId: number
  voucherId: number | 0
  productIds: number[]
}

// ============== ORDER ITEM ===============

export type orderItemResponse = {
  productId: number
  productName: string

  quantity: number
  purchasedPrice: number
  subTotal: number
}
