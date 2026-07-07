import { EllipsisVertical, Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { ReviewResponse } from '../model/review.model'
import AddNewReviewModal from './AddNewReviewModal'
import { useCustomer } from '../context/useCustomer'
import EditReviewModal from './EditReviewModal'
import { useLocation, useNavigate } from 'react-router-dom'
import { useNotification } from '../context/useNotification'

interface ProductReviewProps {
  productId: number
}

export default function ProductReview({ productId }: ProductReviewProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { showNotification } = useNotification()
  const [reviews, setReviews] = useState<ReviewResponse[]>([])
  const [countReviews, setCountReviews] = useState<number>(0)

  const { customerData } = useCustomer()

  const [isOpenModal, setIsOpenModal] = useState(false)
  const [showAddReviewForm, setShowAddReviewForm] = useState(false)
  const [showEditReviewForm, setShowEditReviewForm] = useState(false)

  const [showEditReview, setShowEditReview] = useState({ index: -1, isOpen: false })

  const [selectedReview, setSelectedReview] = useState<ReviewResponse | null>(null)

  const handleAddReview = () => {
    setIsOpenModal(true)
    setShowAddReviewForm(true)
  }

  const onCloseAdd = () => {
    setIsOpenModal(false)
    setShowAddReviewForm(false)
  }

  const onCloseEdit = () => {
    setIsOpenModal(false)
    setShowEditReviewForm(false)
  }

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/products/${productId}/reviews`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        if (response.ok) {
          const reviewData = await response.json()
          setReviews(reviewData)
          setCountReviews(reviewData.length)
        }
      } catch (error) {
        console.error('Error fetching reviews:', error)
      }
    }

    fetchReviews()
  }, [productId])

  return (
    <div className="reviews bg-white p-4 shadow rounded-2xl">
      <div className="review_summary bg-teal-50 rounded-2xl p-4 mb-4 flex items-center justify-between">
        <h2 className="text-green-900 text-lg font-semibold mb-4 uppercase">Tổng quan đánh giá</h2>
        <p className="text-gray-700 mb-2">Số lượng đánh giá: {countReviews}</p>
      </div>
      <div className="reviews-list">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review.reviewId}
              className="review-item relative grid grid-cols-3 mb-4 border-l-4 border-emerald-500 p-3 rounded-2xl shadow"
            >
              <div className="col-span-2">
                <div className="review-header flex items-center mb-2">
                  <span className="review-customer font-semibold mr-2">{review.customerName}</span>
                </div>
                <div className="review-rating flex items-center mb-2">
                  {Array.from({ length: review.reviewRating }, (_, index) => (
                    <Star key={index} className="text-yellow-500 w-4 h-4" size={14} />
                  ))}
                </div>
                <p className="review-content text-gray-700">{review.reviewContent}</p>
              </div>

              <div className="col-span-1">
                <div className="reviewImages flex items-center justify-center gap-2">
                  {/* Review images would be displayed here */}
                  <div className="h-18 w-18 border border-gray-300 rounded-lg overflow-hidden">
                    <img src="/eco_friendly.jpg" alt="" className="w-full h-full object-contain" />
                  </div>
                  <div className="h-18 w-18 border border-gray-300 rounded-lg overflow-hidden">
                    <img src="/eco_friendly.jpg" alt="" className="w-full h-full object-contain" />
                  </div>
                  <div className="h-18 w-18 border border-gray-300 rounded-lg overflow-hidden">
                    <img src="/eco_friendly.jpg" alt="" className="w-full h-full object-contain" />
                  </div>
                </div>
              </div>

              {/* OPTIONS*/}
              {customerData?.userId === review.customerId && (
                <div className="review-options col-span-3 mt-2 absolute top-2 right-2 flex justify-end gap-2 hover:text-gray-800 hover:cursor-pointer">
                  <EllipsisVertical
                    className="text-gray-500 hover:cursor-pointer hover:text-gray-700"
                    size={20}
                    onClick={() => setShowEditReview({ index: 1, isOpen: true })}
                  />
                  {showEditReview.index === 1 && showEditReview.isOpen && (
                    <div className="absolute top-5 right-0 bg-white p-2 rounded-lg shadow-lg min-w-3xs z-10">
                      <div
                        className="p-2 rounded-xl hover:bg-gray-100 hover:cursor-pointer"
                        onClick={() => {
                          console.log('Selected review:', review)
                          setIsOpenModal(true)
                          setSelectedReview(review)
                          setShowEditReviewForm(true)
                        }}
                      >
                        Chỉnh sửa đánh giá
                      </div>
                      <div className="p-2 rounded-xl hover:bg-gray-100 hover:cursor-pointer">
                        Xóa đánh giá
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-700">Chưa có đánh giá nào cho sản phẩm này.</p>
        )}
      </div>

      <div className="flex items-center justify-center gap-5 mt-4">
        <button
          className="bg-white border px-3 py-2 hover:cursor-pointer hover:scale-101
         border-emerald-500 rounded-xl shadow-emerald-500 text-emerald-500 text-lg"
        >
          Xem thêm đánh giá
        </button>
        <button
          onClick={handleAddReview}
          className="bg-primary border px-3 py-2 hover:cursor-pointer hover:scale-101
         rounded-xl shadow-emerald-500 text-white text-lg"
        >
          Thêm đánh giá
        </button>
      </div>

      {/* ADD REVIEW FORM */}
      {isOpenModal && (
        <div className="">
          <div className="fixed inset-0 bg-gray-300/50 blur-lg z-50"></div>
          <div className="fixed inset-0 max-w-4xl top-10  mx-auto z-51">
            {showAddReviewForm ? (
              <AddNewReviewModal onClose={onCloseAdd} productId={productId} />
            ) : null}
            {showEditReviewForm && selectedReview ? (
              <EditReviewModal onClose={onCloseEdit} review={selectedReview} />
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}
