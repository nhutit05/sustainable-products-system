import { CloudUpload, Star, X } from 'lucide-react'
import { useRef, useState } from 'react'
import type { ReviewRequest, ReviewResponse } from '../../model/review.model'
import { useCustomer } from '../../context/useCustomer'
import { useNotification } from '../../context/useNotification'

interface EditReviewModalProps {
  onClose: () => void
  review: ReviewResponse
  onSuccess?: () => void // Callback cập nhật dữ liệu không cần reload
}

export default function EditReviewModal({ onClose, review, onSuccess }: EditReviewModalProps) {
  const [content, setContent] = useState<string>(review.reviewContent)
  const [rating, setRating] = useState<number>(review.reviewRating)
  const [hoverRating, setHoverRating] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(false)

  const { showNotification } = useNotification()
  const { token } = useCustomer()

  const [previewUrl, setPreviewUrl] = useState<string[]>([])
  const [fileList, setFileList] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const selectedFiles = Array.from(files)
      setFileList((prev) => [...prev, ...selectedFiles])
      const newUrls = selectedFiles.map((file) => URL.createObjectURL(file))
      setPreviewUrl((prev) => [...prev, ...newUrls])
      e.target.value = ''
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!content.trim()) {
      showNotification({
        message: 'Vui lòng nhập nội dung đánh giá!',
        type: 'ERROR',
        duration: 3000,
      })
      return
    }

    setIsLoading(true)

    const reviewData: ReviewRequest = {
      reviewContent: content,
      reviewRating: rating,
    }

    const formData = new FormData()
    formData.append('request', new Blob([JSON.stringify(reviewData)], { type: 'application/json' }))

    if (fileList.length > 0) {
      fileList.forEach((file) => {
        formData.append('images', file)
      })
    }

    try {
      const response = await fetch(`http://localhost:8080/api/reviews/${review.reviewId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (response.ok) {
        showNotification({
          message: 'Cập nhật đánh giá thành công!',
          type: 'SUCCESS',
          duration: 3000,
        })

        // Tải lại danh sách đánh giá tại component cha
        if (onSuccess) onSuccess()

        setIsLoading(false)
        onClose()
      } else {
        setIsLoading(false)
        showNotification({
          message: 'Có lỗi xảy ra khi cập nhật đánh giá!',
          type: 'ERROR',
          duration: 3000,
        })
      }
    } catch (error) {
      setIsLoading(false)
      console.error('Error updating review:', error)
      showNotification({
        message: 'Không thể kết nối đến máy chủ!',
        type: 'ERROR',
        duration: 3000,
      })
    }
  }

  const handleRemoveImage = (indexToRemove: number) => {
    URL.revokeObjectURL(previewUrl[indexToRemove])
    setFileList((prev) => prev.filter((_, idx) => idx !== indexToRemove))
    setPreviewUrl((prev) => prev.filter((_, idx) => idx !== indexToRemove))
  }

  return (
    /* CONTAINER MODAL: Giới hạn chiều cao max 90vh, co giãn mượt mà */
    <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col w-full max-w-xl max-h-[90vh] mx-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      {/* 1. HEADER (Cố định ở trên) */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50 shrink-0">
        <h2 className="text-gray-800 text-lg font-bold uppercase tracking-wide">
          Chỉnh sửa đánh giá
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200/60 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>
      </div>

      {/* FORM WRAPPER */}
      <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
        {/* 2. BODY (Có thể cuộn tự động khi nội dung quá dài) */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 custom-scrollbar">
          {/* CHỌN SAO (Interactive Star Rating) */}
          <div className="flex flex-col items-center justify-center p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl">
            <label className="text-sm font-semibold text-emerald-900 mb-2">
              Chỉnh sửa mức độ hài lòng của bạn
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-1 transition-transform hover:scale-110 focus:outline-none cursor-pointer"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    size={28}
                    className={`${
                      star <= (hoverRating || rating)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-gray-300'
                    } transition-colors duration-150`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-medium text-emerald-700 mt-1">
              {rating === 5 && 'Tuyệt vời 😍'}
              {rating === 4 && 'Rất tốt 😃'}
              {rating === 3 && 'Bình thường 🙂'}
              {rating === 2 && 'Kém 🙁'}
              {rating === 1 && 'Rất tệ 😡'}
            </span>
          </div>

          {/* Ô NHẬP NỘI DUNG */}
          <div className="form-group">
            <label
              htmlFor="reviewContent"
              className="block text-sm font-semibold text-gray-700 mb-1.5"
            >
              Nội dung đánh giá <span className="text-red-500">*</span>
            </label>
            <textarea
              id="reviewContent"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3.5 text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none resize-none"
              placeholder="Chia sẻ trải nghiệm sử dụng sản phẩm của bạn..."
            ></textarea>
          </div>

          {/* HIỂN THỊ HÌNH ÁNH ĐÃ CÓ (NẾU CÓ) */}
          {review.reviewImages && review.reviewImages.length > 0 && (
            <div className="form-group">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Hình ảnh đã đính kèm
              </label>
              <div className="flex gap-2 items-center overflow-x-auto p-2 border border-gray-100 rounded-2xl bg-gray-50/50">
                {review.reviewImages.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt="Review attachment"
                    className="w-16 h-16 object-cover rounded-xl border border-gray-200 shrink-0"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Upload hình ảnh */}
          <div className="form-group">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Hình ảnh thực tế (Tùy chọn)
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center border-2 border-dashed border-emerald-200 bg-emerald-50/30 hover:bg-emerald-50/80 rounded-2xl p-3 cursor-pointer transition-all group min-h-25"
              >
                <CloudUpload
                  className="text-emerald-500 group-hover:scale-110 transition-transform"
                  size={26}
                />
                <p className="text-xs font-medium text-emerald-800 mt-1">
                  {fileList.length > 0 ? `Đã chọn ${fileList.length} ảnh` : 'Bấm để tải ảnh lên'}
                </p>
              </div>

              <input
                ref={fileInputRef}
                multiple
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              {/* Danh sách ảnh preview */}
              <div className="border border-gray-100 rounded-2xl p-2 bg-gray-50/50 flex gap-2 items-center overflow-x-auto min-h-25">
                {previewUrl.length > 0 ? (
                  previewUrl.map((url, index) => (
                    <div
                      key={index}
                      className="relative group shrink-0 w-16 h-16 rounded-xl overflow-hidden border border-gray-200"
                    >
                      <img src={url} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-black/60 hover:bg-red-500 text-white rounded-full p-0.5 transition-colors cursor-pointer"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="w-full text-center text-xs text-gray-400">Chưa có ảnh nào</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 3. FOOTER (Cố định ở đáy) */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/30 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all text-sm cursor-pointer disabled:opacity-50"
          >
            Hủy
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-medium text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 shadow-md shadow-emerald-600/20 transition-all text-sm cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Đang lưu...</span>
              </>
            ) : (
              'Cập nhật đánh giá'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
