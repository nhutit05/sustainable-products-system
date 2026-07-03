import React, { createContext, useMemo, useState } from 'react'
import { type NotificationTypeKey } from '../enum/Notification.enum'

// Định nghĩa cấu hình đầy đủ của một Notification
interface NotificationState {
  message: string
  type: NotificationTypeKey
  duration: number
  isOpen: boolean
}

// Định nghĩa kiểu dữ liệu cho Context (Bao gồm dữ liệu và các hàm cập nhật state)
interface NotificationContextType extends NotificationState {
  setNotification: (config: Partial<Omit<NotificationState, 'isOpen'>>) => void
  setIsOpen: (isOpen: boolean) => void
  showNotification: (
    config: Partial<Omit<NotificationState, 'isOpen'>> & { message: string }
  ) => void
  hideNotification: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  // Quản lý toàn bộ thông tin thông báo bằng 1 state duy nhất để tránh re-render lẻ tẻ
  const [state, setState] = useState<NotificationState>({
    message: '',
    type: 'INFO',
    duration: 3000,
    isOpen: false,
  })

  // Hàm tiện ích để cập nhật nhanh thông tin nội dung và loại thông báo
  const setNotification = (config: Partial<Omit<NotificationState, 'isOpen'>>) => {
    setState((prev) => ({
      ...prev,
      ...config,
    }))
  }

  const showNotification = (
    config: Partial<Omit<NotificationState, 'isOpen'>> & { message: string }
  ) => {
    setState((prev) => ({
      ...prev,
      ...config,
      isOpen: true,
    }))
  }

  // Hàm bật/tắt hiển thị thông báo
  const setIsOpen = (isOpen: boolean) => {
    setState((prev) => ({ ...prev, isOpen }))
  }

  const hideNotification = () => {
    setState((prev) => ({
      ...prev,
      isOpen: false,
    }))
  }

  // Tối ưu hiệu năng bằng useMemo để tránh việc render lại không cần thiết cho con
  const contextValue = useMemo(
    () => ({
      ...state,
      setNotification,
      setIsOpen,
      showNotification,
      hideNotification,
    }),
    [state]
  )

  return (
    <NotificationContext.Provider value={contextValue}>{children}</NotificationContext.Provider>
  )
}

export { NotificationContext }
