import { CheckCircleIcon, Loader, XCircleIcon, type LucideIcon } from 'lucide-react'

export const RefundSlipStatusName = {
  PENDING: 'Đang chờ xử lý',
  APPROVED: 'Đã duyệt',
  REJECTED: 'Đã từ chối',
  REFUNDED: 'Đã hoàn tiền',
}

export type RefundSlipStatusType = keyof typeof RefundSlipStatusName

export const RefundSlipStatusColor: Record<RefundSlipStatusType, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-400',
  APPROVED: 'bg-blue-100 text-blue-800 border-blue-400',
  REJECTED: 'bg-red-50 text-red-800 border-red-400',
  REFUNDED: 'bg-green-100 text-green-800 border-green-400',
}

export const RefundSlipStatusIcon: Record<RefundSlipStatusType, LucideIcon> = {
  PENDING: Loader,
  APPROVED: CheckCircleIcon,
  REJECTED: XCircleIcon,
  REFUNDED: CheckCircleIcon,
}
