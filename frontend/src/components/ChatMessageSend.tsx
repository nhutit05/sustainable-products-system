interface ChatMessageSendProps {
  sendMessage: string
}

export default function ChatMessageSend({ sendMessage }: ChatMessageSendProps) {
  return (
    <div className="flex flex-col items-end my-2">
      <div className="border border-green-500 rounded-full w-fit px-4 py-2  text-green-600">
        {sendMessage}
      </div>
    </div>
  )
}
