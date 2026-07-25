export interface Notification {
  notificationId: number
  title: string
  message: string
  type: 'NEW_VOUCHER' | 'ORDER_STATUS_CHANGED' | 'NEW_ORDER' | 'NEW_REFUND_REQUEST'
  referenceId: number | null
  referenceType: string | null
  isRead: boolean
  createdAt: string
}
