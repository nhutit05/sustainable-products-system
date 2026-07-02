export type CartItemResponse = {
  cartId: number
  productId: number
  productName: string
  quantity: number
  subtotal: number
}

export type CartItemRequest = {
  cartId: number
  productId: number
  quantity: number
}

export type Cart = {
  cartId: number
  customerId: number
  cartedAt: string
  customerUsername: string
}
