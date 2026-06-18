export type NotificationType = 'info' | 'warning' | 'error' | 'success'

export type Notification = {
  message: string
  type: NotificationType
}
