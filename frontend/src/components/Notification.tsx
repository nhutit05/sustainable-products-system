import { useEffect } from 'react'
import {
  NotificationTypeClasses,
  NotificationTypeIcon,
  NotificationTypeTitle,
} from '../enum/Notification.enum'
import { useNotification } from '../context/useNotification'
import { X } from 'lucide-react'

export default function Notification() {
  const { isOpen, message, type, duration, hideNotification } = useNotification()

  const IconComponent = NotificationTypeIcon[type]
  const notificationClasses = NotificationTypeClasses[type]

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const timer = setTimeout(() => {
      hideNotification()
    }, duration)

    return () => clearTimeout(timer)
  }, [isOpen, duration, hideNotification])

  if (!isOpen) {
    return null
  }

  return (
    <div
      className={` fade-in-out-once rounded-xl min-w-2xl fixed top-10 left-1/2 transform -translate-x-1/2 shadow bg-noti overflow-hidden border-l-4 ${notificationClasses.border} z-100`}
    >
      <div className="relative p-4">
        <div className="flex items-center gap-3">
          <div className="noti-icon">
            {IconComponent ? (
              <IconComponent className={`w-6 h-6 ${notificationClasses.icon}`} />
            ) : null}
          </div>
          <div className="noti_content text-left">
            <h2 className={`text-lg font-bold ${notificationClasses.title}`}>
              {NotificationTypeTitle[type]}
            </h2>
            <p className="text-sm text-gray-600 mt-0.5">{message}</p>
          </div>
          {/* Nút bấm để tắt thông báo chủ động trước khi hết timeout */}
          <button
            onClick={hideNotification}
            className="ml-2 text-gray-400 hover:text-gray-600 font-bold absolute top-2 right-2 focus:outline-none"
          >
            <X className="w-4 h-4" size={40} />
          </button>
        </div>
      </div>
    </div>
  )
}
