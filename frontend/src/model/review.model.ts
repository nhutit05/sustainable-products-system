export type ReviewResponse = {
  reviewId: number
  reviewContent: string
  reviewRating: number
  customerId: number
  customerName: string
  productId: number
}

export type ReviewRequest = {
  reviewContent: string
  reviewRating: number
}
