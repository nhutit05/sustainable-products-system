import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Notification } from '../model/notification.model'
import {
  getNotifications,
  getUnreadCount,
  markAsRead as apiMarkAsRead,
  markAllAsRead as apiMarkAllAsRead,
} from '../services/notification.service'
import { useNotificationSocket } from '../hooks/useNotificationSocket'
import { useNotification } from './useNotification'

export interface NotificationBellContextType {
  notifications: Notification[]
  unreadCount: number
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  fetchNotifications: () => Promise<void>
  markAsRead: (notificationId: number) => Promise<void>
  markAllAsRead: () => Promise<void>
}

const NotificationBellContext = createContext<NotificationBellContextType | undefined>(undefined)

export const NotificationBellProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const token = localStorage.getItem('token')
  const { showNotification } = useNotification()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleNewNotification = useCallback(
    (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev])
      setUnreadCount((prev) => prev + 1)
      showNotification({
        message: notification.title,
        type: 'INFO',
        duration: 4000,
      })
    },
    [showNotification]
  )

  const getUserId = useCallback((): string | null => {
    if (!token) return null
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.sub || null
    } catch {
      return null
    }
  }, [token])

  const userId = getUserId()

  useNotificationSocket({
    token,
    userId,
    onNotification: handleNewNotification,
  })

  const fetchNotifications = useCallback(async () => {
    if (!token) return
    try {
      const [notifs, count] = await Promise.all([getNotifications(token), getUnreadCount(token)])
      setNotifications(notifs)
      setUnreadCount(count)
    } catch {
      // silently ignore
    }
  }, [token])

  const markAsRead = useCallback(
    async (notificationId: number) => {
      if (!token) return
      try {
        await apiMarkAsRead(token, notificationId)
        setNotifications((prev) =>
          prev.map((n) => (n.notificationId === notificationId ? { ...n, isRead: true } : n))
        )
        setUnreadCount((prev) => Math.max(0, prev - 1))
      } catch {
        // silently ignore
      }
    },
    [token]
  )

  const markAllAsRead = useCallback(async () => {
    if (!token) return
    try {
      await apiMarkAllAsRead(token)
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
      setUnreadCount(0)
    } catch {
      // silently ignore
    }
  }, [token])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      isOpen,
      setIsOpen,
      fetchNotifications,
      markAsRead,
      markAllAsRead,
    }),
    [notifications, unreadCount, isOpen, fetchNotifications, markAsRead, markAllAsRead]
  )

  return (
    <NotificationBellContext.Provider value={value}>
      <div ref={dropdownRef}>{children}</div>
    </NotificationBellContext.Provider>
  )
}

export { NotificationBellContext }
