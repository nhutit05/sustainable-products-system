export interface RevenueByCategory {
  categoryId: number
  categoryName: string
  revenue: number
  orderCount: number
  percentage: number
}

export interface TopProduct {
  productId: number
  productName: string
  categoryName: string
  totalQuantity: number
  totalRevenue: number
  productImage: string
}

export interface OrderStatusDistribution {
  statusName: string
  count: number
  percentage: number
}

export interface ReviewStats {
  averageRating: number
  totalReviews: number
  rating1Count: number
  rating2Count: number
  rating3Count: number
  rating4Count: number
  rating5Count: number
}

export interface RefundStats {
  totalRefunds: number
  pendingCount: number
  approvedCount: number
  rejectedCount: number
  refundedCount: number
  totalRefundAmount: number
  refundRate: number
}

export interface VoucherStat {
  voucherId: number
  code: string
  discountValue: number
  usageCount: number
  totalDiscountGiven: number
  isActive: boolean
}

export interface CarbonIndexStats {
  averageCarbonIndex: number
  lowCarbonCount: number
  mediumCarbonCount: number
  highCarbonCount: number
  totalProducts: number
}

export interface TopCustomer {
  customerId: number
  username: string
  totalOrders: number
  totalSpent: number
  averageOrderValue: number
}

export type ReportType =
  | 'revenue-by-category'
  | 'top-products'
  | 'order-status'
  | 'reviews'
  | 'refunds'
  | 'vouchers'
  | 'carbon'
  | 'top-customers'
  | 'all'

export type ExportFormat = 'excel' | 'pdf'
