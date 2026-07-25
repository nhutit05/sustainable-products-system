import axios from 'axios'
import type { Notification } from '../model/notification.model'

const API_URL = 'http://localhost:8080/api/notifications'

export async function getNotifications(token: string): Promise<Notification[]> {
  const response = await axios.get<Notification[]>(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export async function getUnreadCount(token: string): Promise<number> {
  const response = await axios.get<number>(`${API_URL}/unread-count`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export async function markAsRead(token: string, notificationId: number): Promise<Notification> {
  const response = await axios.put<Notification>(
    `${API_URL}/${notificationId}/read`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return response.data
}

export async function markAllAsRead(token: string): Promise<void> {
  await axios.put(`${API_URL}/read-all`, {}, { headers: { Authorization: `Bearer ${token}` } })
}
