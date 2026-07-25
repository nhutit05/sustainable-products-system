import axios from 'axios'
import type { Notification } from '../model/notification.model'

const API_URL = 'http://localhost:8080/api/notifications'

export interface NotificationSummary {
  notifications: Notification[]
  unreadCount: number
}

export async function getNotificationSummary(token: string): Promise<NotificationSummary> {
  const response = await axios.get<NotificationSummary>(`${API_URL}/summary`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { page: 0, size: 50 },
  })
  return response.data
}

export async function markAsRead(token: string, notificationId: number): Promise<void> {
  await axios.put(
    `${API_URL}/${notificationId}/read`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  )
}

export async function markAllAsRead(token: string): Promise<void> {
  await axios.put(`${API_URL}/read-all`, {}, { headers: { Authorization: `Bearer ${token}` } })
}
