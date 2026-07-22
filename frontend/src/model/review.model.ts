export type ReviewResponse = {
  reviewId: number
  reviewContent: string
  reviewRating: number
  reviewImages: string[]
  customerId: number
  customerName: string
  productId: number
  isHidden: boolean
}

export type ReviewRequest = {
  reviewContent: string
  reviewRating: number
}
