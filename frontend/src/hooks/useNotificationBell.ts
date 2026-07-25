import { useContext } from 'react'
import { NotificationBellContext } from '../context/NotificationBellContext'

export const useNotificationBell = () => {
  const context = useContext(NotificationBellContext)
  if (!context) {
    throw new Error('useNotificationBell must be used within a NotificationBellProvider')
  }
  return context
}
