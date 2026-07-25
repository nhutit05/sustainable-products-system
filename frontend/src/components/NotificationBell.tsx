import { Bell, CheckCheck, Package, Ticket, RotateCcw, X } from 'lucide-react'
import { useNotificationBell } from '../hooks/useNotificationBell'
import { useNavigate } from 'react-router-dom'
import type { Notification } from '../model/notification.model'

const NOTIFICATION_ICONS: Record<string, React.ReactNode> = {
  NEW_VOUCHER: <Ticket className="w-5 h-5 text-emerald-500" />,
  ORDER_STATUS_CHANGED: <Package className="w-5 h-5 text-blue-500" />,
  NEW_ORDER: <Package className="w-5 h-5 text-orange-500" />,
  NEW_REFUND_REQUEST: <RotateCcw className="w-5 h-5 text-red-500" />,
}

function getTimeAgo(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return 'Vừa xong'
  if (diffMins < 60) return `${diffMins} phút trước`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours} giờ trước`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays} ngày trước`
}

function getNotificationRoute(notification: Notification): string | null {
  switch (notification.type) {
    case 'NEW_VOUCHER':
      return '/products'
    case 'ORDER_STATUS_CHANGED':
      return '/profile/orders'
    case 'NEW_ORDER':
      return '/admin/orders'
    case 'NEW_REFUND_REQUEST':
      return '/admin/refunds'
    default:
      return null
  }
}

interface NotificationBellProps {
  className?: string
}

export default function NotificationBell({ className = '' }: NotificationBellProps) {
  const { notifications, unreadCount, isOpen, setIsOpen, markAsRead, markAllAsRead } =
    useNotificationBell()
  const navigate = useNavigate()

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await markAsRead(notification.notificationId)
    }
    const route = getNotificationRoute(notification)
    if (route) {
      navigate(route)
    }
    setIsOpen(false)
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-green-700 hover:bg-green-100 transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 min-w-4.5 h-4.5 px-1 text-[10px] font-bold text-white bg-red-500 rounded-full flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="font-bold text-gray-800">Thông báo</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Đã đánh dấu tất cả
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-gray-400">
                <Bell className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Chưa có thông báo nào</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.notificationId}
                  onClick={() => handleNotificationClick(notification)}
                  className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-50 ${
                    !notification.isRead ? 'bg-emerald-50/50' : ''
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    {NOTIFICATION_ICONS[notification.type] || (
                      <Bell className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm leading-snug ${
                        !notification.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'
                      }`}
                    >
                      {notification.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {getTimeAgo(notification.createdAt)}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <div className="shrink-0 mt-1">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
