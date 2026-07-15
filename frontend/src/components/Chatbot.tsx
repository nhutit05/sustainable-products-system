import { Bot, ChevronDown, Send, Sparkles, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { Message } from '../model/message.model'

const quickActions = [
  'Tôi muốn xem sản phẩm mới',
  'Tư vấn đơn hàng của tôi',
  'Hướng dẫn thanh toán',
]

interface ChatbotProps {
  isChatbotOpen: boolean
  setIsChatbotOpen: (isOpen: boolean) => void
}

type ResizeDirection = 'top-left' | 'left' | 'top' | null

interface Dimensions {
  width: number
  height: number
}

interface StartOffset {
  startX: number
  startY: number
  startWidth: number
  startHeight: number
}

export default function Chatbot({ isChatbotOpen, setIsChatbotOpen }: ChatbotProps) {
  const [dimensions, setDimensions] = useState<Dimensions>({ width: 360, height: 520 })
  const isResizing = useRef<ResizeDirection>(null)
  const [activeResizeDirection, setActiveResizeDirection] = useState<ResizeDirection>(null)
  const startOffset = useRef<StartOffset>({ startX: 0, startY: 0, startWidth: 0, startHeight: 0 })

  // cai dat state cho draftMessage va messages
  const [draftMessage, setDraftMessage] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'bot-welcome',
      content:
        'Xin chào! Tôi có thể hỗ trợ bạn tìm sản phẩm, tư vấn đơn hàng hoặc trả lời các câu hỏi thường gặp.',
      sender: 'bot',
    },
  ])

  const [isSending, setIsSending] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  // cai dat ref de luu id cua tin nhan hien tai
  const messageIdRef = useRef(0)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const closeChatbot = () => {
    setIsChatbotOpen(false)
  }

  const fetchedMessage = async (message: string) => {
    setIsSending(true)
    try {
      const response = await fetch(`http://localhost:8080/api/chat/rag?q=${message}`)
      const data = await response.text()
      return data
    } catch (error) {
      console.error('Error fetching chat message:', error)
      return null
    } finally {
      setIsSending(false)
    }
  }

  const handleSendMessage = async (message: string) => {
    const trimmedMessage = message.trim()

    if (!trimmedMessage) {
      return
    }

    // tang id cua tin nhan hien tai de tao id cho tin nhan tiep theo
    messageIdRef.current += 1
    const messageId = messageIdRef.current

    // tao tin nhan cua user gui
    const nextUserMessage: Message = {
      id: `user-${messageId}-1`,
      content: trimmedMessage,
      sender: 'user',
    }

    // hien thi tin nhan cua user truoc khi fetch response tu bot
    setMessages((currentMessages) => [...currentMessages, nextUserMessage])
    setIsSending(true)
    setDraftMessage('')

    try {
      const fetchedResponse = await fetchedMessage(trimmedMessage)
      const nextBotMessage: Message = {
        id: `bot-${messageId}-2`,
        content:
          fetchedResponse ||
          'Xin lỗi, tôi không thể trả lời câu hỏi của bạn vào lúc này. Vui lòng thử lại sau.',
        sender: 'bot',
      }
      // thi hien thi tin nhan cua bot sau khi fetch response tu bot
      setMessages((currentMessages) => [...currentMessages, nextBotMessage])
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSendMessage(draftMessage)
    }
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, direction: ResizeDirection) => {
    e.preventDefault()
    isResizing.current = direction
    setActiveResizeDirection(direction) // bat overlay khi bat dau resize

    startOffset.current = {
      startX: e.clientX,
      startY: e.clientY,
      startWidth: dimensions.width,
      startHeight: dimensions.height,
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing.current) return
    const { startX, startY, startWidth, startHeight } = startOffset.current

    let newWidth = startWidth
    let newHeight = startHeight

    const deltaX = startX - e.clientX
    const deltaY = startY - e.clientY

    if (isResizing.current === 'left' || isResizing.current === 'top-left') {
      newWidth = Math.max(320, Math.min(window.innerWidth - 40, startWidth + deltaX))
    }
    if (isResizing.current === 'top' || isResizing.current === 'top-left') {
      newHeight = Math.max(400, Math.min(window.innerHeight - 80, startHeight + deltaY))
    }

    setDimensions({ width: newWidth, height: newHeight })
  }

  const handleMouseUp = () => {
    isResizing.current = null
    setActiveResizeDirection(null) // Tat overlay khi ket thuc resize
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  return (
    <div
      style={{ width: `${dimensions.width}px`, height: `${dimensions.height}px` }}
      className="fixed bottom-10 right-10 z-50 flex flex-col overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.22)] max-w-[calc(100vw-2rem)] transition-shadow duration-300"
    >
      <div
        onMouseDown={(e) => handleMouseDown(e, 'top-left')}
        className="absolute top-0 left-0 z-50 h-5 w-5 cursor-nwse-resize rounded-tl-3xl transition-colors hover:bg-emerald-500/10 active:bg-emerald-500/20"
        title="Kéo để thay đổi kích thước"
      />
      {/* Keo ngang canh trai*/}
      <div
        onMouseDown={(e) => handleMouseDown(e, 'left')}
        className="absolute top-5 left-0 z-40 h-[calc(100%-1.25rem)] w-1.5 cursor-ew-resize transition-colors hover:bg-emerald-500/10 active:bg-emerald-500/20"
      />
      {/* Keo doc canh tren*/}
      <div
        onMouseDown={(e) => handleMouseDown(e, 'top')}
        className="absolute top-0 left-5 z-40 h-1.5 w-[calc(100%-1.25rem)] cursor-ns-resize transition-colors hover:bg-emerald-500/10 active:bg-emerald-500/20"
      />

      {/* HEADER*/}
      <header className="flex shrink-0 items-start justify-between gap-4 bg-primary p-2 text-white">
        <div className="flex items-center gap-3">
          <div className="mt-0.5 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
            <Bot className="h-6 w-6" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
              ReGreen Assistant
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={closeChatbot}
          aria-label="Đóng chatbot"
          className="rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </header>

      <div className="flex flex-1 flex-col min-h-0 overflow-hidden bg-slate-50">
        {/* GỢI Ý NHANH */}
        <div className="shrink-0 border-b border-emerald-100 bg-emerald-50/70 px-4 py-3 text-left text-sm text-emerald-950">
          <div className="flex items-center gap-2 font-medium">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            Gợi ý nhanh
          </div>
          <div className="mt-3 flex flex-wrap gap-2 max-h-24 overflow-y-auto">
            {quickActions.map((action) => (
              <button
                key={action}
                type="button"
                onClick={() => handleSendMessage(action)}
                className="rounded-full border border-emerald-200 bg-white px-3 py-2 text-xs font-medium text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100"
              >
                {action}
              </button>
            ))}
          </div>
        </div>

        {isChatbotOpen && (
          <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-hide space-y-3 text-left">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-3xl px-4 py-3 text-sm leading-6 shadow-sm ${
                    message.sender === 'user'
                      ? 'rounded-br-lg bg-primary text-white'
                      : 'rounded-bl-lg border border-slate-200 bg-white text-slate-800'
                  }`}
                >
                  {message.sender === 'bot' && (
                    <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
                      <Bot className="h-3.5 w-3.5" />
                      ReGreen
                    </div>
                  )}
                  <p>{message.content}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />

            {isSending && (
              <div className="flex justify-start animate-pulse">
                <div className="max-w-[85%] rounded-xl rounded-bl-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 shadow-sm">
                  <div className="mb-1 flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-emerald-600">
                    <Bot className="h-3.5 w-3.5" />
                    AI đang suy nghĩ ...
                  </div>
                  <div className="flex space-x-1 py-1">
                    <span className="h-0.5 w-0.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="h-0.5 w-0.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="h-0.5 w-0.5 rounded-full bg-slate-400 animate-bounce"></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <footer className="shrink-0 border-t border-slate-200 bg-white p-4">
        <div className="flex items-center gap-3 rounded-[1.25rem] border border-slate-200 bg-slate-50 px-3 py-3 shadow-inner focus-within:border-emerald-300 focus-within:bg-white">
          <textarea
            placeholder="Nhập nội dung bạn muốn gửi..."
            value={draftMessage}
            onChange={(event) => setDraftMessage(event.target.value)}
            onKeyDown={handleKeyDown}
            className="min-w-0 h-full flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 resize-none"
          />

          <button
            type="button"
            onClick={() => handleSendMessage(draftMessage)}
            disabled={!draftMessage.trim()}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Gửi tin nhắn"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
          <span>Nhấn Enter để gửi</span>
          <button
            type="button"
            onClick={() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-1 text-emerald-700 transition hover:text-emerald-800"
          >
            <ChevronDown className="h-3.5 w-3.5" />
            Cuộn về cuối
          </button>
        </div>
      </footer>
    </div>
  )
}
