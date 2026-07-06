import { CloudUpload, X } from 'lucide-react'
import { useState } from 'react'
import type { ReviewRequest } from '../model/review.model'
import { useCustomer } from '../context/useCustomer'
import { useNotification } from '../context/useNotification'
import { useNavigate } from 'react-router-dom'

interface AddNewReviewModalProps {
  onClose: () => void
  productId: number
}

export default function AddNewReviewModal({ onClose, productId }: AddNewReviewModalProps) {
  const [content, setContent] = useState<string>('')
  const [rating, setRating] = useState<number>(0)

  const { showNotification } = useNotification()

  const { token } = useCustomer()

  const navigate = useNavigate()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const reviewData: ReviewRequest = {
      reviewContent: content,
      reviewRating: rating,
    }

    const response = await fetch(`http://localhost:8080/api/products/${productId}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reviewData),
    })

    if (response.ok) {
      setTimeout(() => {
        showNotification({
          message: 'Đánh giá đã được gửi thành công!',
          type: 'SUCCESS',
          duration: 3000,
        })
        onClose() // Close the modal after successful submission
      }, 1000)
      navigate(0) // Refresh the page to show the new review
    } else {
      console.error('Error submitting review:', response.statusText)
      showNotification({
        message: 'Có lỗi xảy ra khi gửi đánh giá!',
        type: 'ERROR',
        duration: 3000,
      })
    }
  }
  return (
    <div className="addReview bg-white p-4 shadow rounded-2xl">
      <X
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer"
        size={20}
        onClick={onClose}
      />
      <h2 className="text-green-900 text-lg font-semibold mg-4 uppercase text-center">
        Thêm đánh giá
      </h2>
      <form action="" onSubmit={handleSubmit}>
        <div className="form-group mb-4">
          <label htmlFor="reviewContent" className="block mb-2 font-semibold text-green-900">
            Viết đánh giá của bạn:
          </label>
          <textarea
            id="reviewContent"
            name="reviewContent"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-xl"
            rows={4}
            placeholder="Nhập đánh giá của bạn..."
          ></textarea>
        </div>
        <div className="form-group mb-4">
          <label htmlFor="reviewRating" className="block mb-2 font-semibold text-green-900">
            Đánh giá (1-5 sao):
          </label>
          <select
            id="reviewRating"
            name="reviewRating"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-xl"
          >
            <option value="1">1 sao</option>
            <option value="2">2 sao</option>
            <option value="3">3 sao</option>
            <option value="4">4 sao</option>

            <option value="5">5 sao</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="form-group">
            <label className="block font-semibold mb-1 text-green-900">Hình ảnh sản phẩm</label>
            <div
              onClick={() => {
                const fileInput = document.querySelector<HTMLInputElement>('#addProductImageUpload')
                if (fileInput) {
                  fileInput.click()
                }
              }}
              className="upload_area flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-3 cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <CloudUpload className="mx-auto text-gray-400" size={32} />
              <p className="text-center text-gray-500 mt-2">Chọn hình ảnh</p>
            </div>
            <input type="file" className="hidden" id="addProductImageUpload" />
          </div>
          <div className="uploadImage_review"></div>
        </div>

        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            className="text-red-500 px-4 py-2 border rounded-xl hover:bg-red-500 hover:text-white hover:cursor-pointer border-red-500"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            type="submit"
            className=" bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 hover:cursor-pointer shadow transition-colors"
          >
            Gửi đánh giá
          </button>
        </div>
      </form>
    </div>
  )
}
