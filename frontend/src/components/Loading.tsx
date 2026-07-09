interface LoadingProps {
  message?: string
}

export default function Loading({ message }: LoadingProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4 shadow-xl">
        <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>

        <p className="font-semibold text-gray-700">{message || 'Đang xử lý...'}</p>
      </div>
    </div>
  )
}
