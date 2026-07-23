// ================ ORDER STATUS ===============

export type orderStatusResponse = {
  orderStatusId: number
  orderStatusName: string
}

export type paymentStatusResponse = {
  paymentStatusId: number
  paymentStatusName: string
}

export type paymentMethodResponse = {
  paymentMethodId: number
  paymentMethodName: string
  online: boolean
}

// ================ ORDER ===============

export interface orderResponse {
  orderId: number
  orderedAt: string

  orderReceiver: string
  orderReceiverPhone: string
  orderAddress: string

  customerId: number
  customerUsername: string

  paymentMethodId: number
  paymentMethodName: string

  paymentStatusId: number
  paymentStatusName: string

  voucherId: number | null
  voucherCode: string | null

  orderStatusId: number
  orderStatusName: string

  totalAmount: number

  items: orderItemResponse[]
}

export type OrderRequest = {
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

export interface orderSummaryResponse {
  orderId: number

  orderedAt: string

  totalAmount: number

  customerId: number

  customerUsername: string

  paymentMethodId: number

  paymentMethodName: string

  paymentStatusId: number

  paymentStatusName: string

  orderStatusId: number

  orderStatusName: string
}
export interface PageResponse<T> {
  content: T[]

  totalElements: number

  totalPages: number

  size: number

  number: number

  first: boolean

  last: boolean

  empty: boolean
}

// ================= REFUND =================
export interface RefundSlipRequest {
  bankNumber: string
  accountBankName: string
  reason: string
  orderId: number
  bankId: string
}
