import { CheckCircleIcon, Loader, TruckIcon, XCircleIcon, type LucideIcon } from 'lucide-react'

export const OrderStatusName = {
  PENDING: 'Đang chờ xử lý',
  CANCELLED: 'Đã hủy',
  CONFIRMED: 'Đã xác nhận',
  COMPLETED: 'Đã hoàn thành',
  SHIPPING: 'Đang giao hàng',
}

export type OrderStatusType = keyof typeof OrderStatusName

export const OrderStatusColor: Record<OrderStatusType, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-400',
  CANCELLED: 'bg-red-50 text-red-800 border-red-400',
  CONFIRMED: 'bg-blue-100 text-blue-800 border-blue-400',
  COMPLETED: 'bg-green-100 text-green-800 border-green-400',
  SHIPPING: 'bg-purple-100 text-purple-800 border-purple-400',
}

export const OrderStatusIcon: Record<OrderStatusType, LucideIcon> = {
  PENDING: Loader,
  CANCELLED: XCircleIcon,
  CONFIRMED: CheckCircleIcon,
  COMPLETED: CheckCircleIcon,
  SHIPPING: TruckIcon,
}
