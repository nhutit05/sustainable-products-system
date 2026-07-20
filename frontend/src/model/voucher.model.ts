export type voucherResponse = {
  voucherId: number
  code: string
  description: string
  discountValue: number
  startedAt: string
  expiredAt: string
  quantity: number
  isActive: boolean
  minOrderValue: number
  maxDiscountAmount: number
}
export interface VoucherSummary {
  voucherId: number
  code: string
  description: string
  discountValue: number
  startedAt: string
  quantity: number
  expiredAt: string
  isActive: boolean
  minOrderValue: number
  maxDiscountAmount: number
}

export interface VoucherResponse {
  voucherId: number
  code: string
  description: string
  discountValue: number
  startedAt: string
  expiredAt: string
  quantity: number
  isActive: boolean
  minOrderValue: number
  maxDiscountAmount: number
}

export interface VoucherRequest {
  code: string
  description: string
  discountValue: number
  startedAt: string
  expiredAt: string
  quantity: number
  isActive: boolean
  minOrderValue: number
  maxDiscountAmount: number
}

export interface VoucherPatchRequest {
  code?: string
  description?: string
  discountValue?: number
  quantity?: number
  startedAt?: string
  expiredAt?: string
  isActive?: boolean
  minOrderValue?: number
  maxDiscountAmount?: number
}

export interface VoucherQuery {
  page: number
  size: number
  keyword?: string
  active?: boolean
  sortBy?: string
  direction?: 'asc' | 'desc'
}
