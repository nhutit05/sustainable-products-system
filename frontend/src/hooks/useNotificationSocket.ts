import { useEffect, useRef, useCallback } from 'react'
import { Client, type IMessage } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import type { Notification } from '../model/notification.model'

interface UseNotificationSocketOptions {
  token: string | null
  userId: string | null
  onNotification: (notification: Notification) => void
}

export function useNotificationSocket({
  token,
  userId,
  onNotification,
}: UseNotificationSocketOptions) {
  const clientRef = useRef<Client | null>(null)

  const connect = useCallback(() => {
    if (!token || !userId) return

    if (clientRef.current?.active) {
      clientRef.current.deactivate()
    }

    const client = new Client({
      webSocketFactory: () => new SockJS(`http://localhost:8080/ws?token=${token}`),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        client.subscribe(`/user/${userId}/queue/notifications`, (message: IMessage) => {
          try {
            const notification: Notification = JSON.parse(message.body)
            onNotification(notification)
          } catch {
            // silently ignore parse errors
          }
        })
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame.headers['message'])
      },
    })

    client.activate()
    clientRef.current = client
  }, [token, userId, onNotification])

  const disconnect = useCallback(() => {
    if (clientRef.current?.active) {
      clientRef.current.deactivate()
      clientRef.current = null
    }
  }, [])

  useEffect(() => {
    connect()
    return () => disconnect()
  }, [connect, disconnect])

  return { disconnect }
}
