import { Bot } from 'lucide-react'

interface ChatMessageResponseProps {
  sendMessage: string
}

export default function ChatMessageResponse({ sendMessage }: ChatMessageResponseProps) {
  return (
    <div className="flex flex-col items-start mt-2 mb-3">
      <div className="flex items-center mb-1">
        <Bot className="mr-2 w-6 h-6 text-gray-900" size={20} />
        <div className="bg-gray-200 rounded-full w-fit px-4 py-2 text-gray-900">
          {sendMessage}
        </div>{' '}
      </div>
    </div>
  )
}
