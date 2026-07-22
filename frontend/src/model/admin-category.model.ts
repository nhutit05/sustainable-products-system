export interface CityAdminResponse {
  cityId: number
  cityName: string
  cityLevel: string
}

export interface VillageAdminResponse {
  villageId: number
  villageName: string
  villageLevel: string
  cityId: number
  cityName: string
}

export interface PageResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  last: boolean
}

export interface CustomerAdminResponse {
  userId: number
  username: string
  email: string
  numberPhone: string
  nationalId: string
  accumulatedEcoPoints: number
  isActive: boolean
}

export interface BankAdminResponse {
  bankId: string
  bankShortName: string
  bankName: string
}

export interface CategoryAdminResponse {
  categoryId: number
  categoryName: string
}

export interface MaterialAdminResponse {
  materialId: number
  materialName: string
  emissionIndex: number
}

export interface OrderStatusAdminResponse {
  orderStatusId: number
  orderStatusName: string
}

export interface PaymentStatusAdminResponse {
  paymentStatusId: number
  paymentStatusName: string
}

export interface PaymentMethodAdminResponse {
  paymentMethodId: number
  paymentMethodName: string
  online: boolean
}
