import { CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react'

export const NotificationType = {
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  INFO: 'info',
} as const

export type NotificationTypeKey = keyof typeof NotificationType

export const NotificationTypeColor: Record<NotificationTypeKey, string> = {
  SUCCESS: 'green',
  WARNING: 'amber',
  ERROR: 'red',
  INFO: 'blue',
}

export const NotificationTypeClasses: Record<
  NotificationTypeKey,
  {
    border: string
    icon: string
    title: string
  }
> = {
  SUCCESS: {
    border: 'border-green-500',
    icon: 'text-green-500',
    title: 'text-green-500',
  },
  WARNING: {
    border: 'border-amber-500',
    icon: 'text-amber-500',
    title: 'text-amber-500',
  },
  ERROR: {
    border: 'border-red-500',
    icon: 'text-red-500',
    title: 'text-red-500',
  },
  INFO: {
    border: 'border-blue-500',
    icon: 'text-blue-500',
    title: 'text-blue-500',
  },
}

export const NotificationTypeIcon: Record<
  NotificationTypeKey,
  React.ComponentType<{ className?: string }>
> = {
  SUCCESS: CheckCircle2,
  WARNING: AlertTriangle,
  ERROR: XCircle,
  INFO: Info,
}

export const NotificationTypeTitle: Record<NotificationTypeKey, string> = {
  SUCCESS: 'Thành công',
  WARNING: 'Cảnh báo',
  ERROR: 'Lỗi',
  INFO: 'Thông báo',
}
