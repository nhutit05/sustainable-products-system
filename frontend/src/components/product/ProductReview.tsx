import { EllipsisVertical, Star, ChevronDown, ChevronUp } from 'lucide-react'
import { useEffect, useState, useCallback } from 'react'
import type { ReviewResponse } from '../../model/review.model'
import AddNewReviewModal from '../admin/AddNewReviewModal'
import { useCustomer } from '../../context/useCustomer'
import EditReviewModal from './EditReviewModal'
import { useNotification } from '../../context/useNotification'

interface ProductReviewProps {
  productId: number
}

// Số lượng review hiển thị ban đầu & mỗi lần bấm "Xem thêm"
const REVIEWS_PER_PAGE = 3

export default function ProductReview({ productId }: ProductReviewProps) {
  const { showNotification } = useNotification()
  const { token, customerData } = useCustomer()

  const [reviews, setReviews] = useState<ReviewResponse[]>([])
  const [countReviews, setCountReviews] = useState<number>(0)

  // State quản lý số lượng đánh giá hiển thị trên giao diện
  const [visibleCount, setVisibleCount] = useState<number>(REVIEWS_PER_PAGE)

  // State quản lý review ID đang được thực hiện xóa (để hiện loading)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  // Modal State
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [showAddReviewForm, setShowAddReviewForm] = useState(false)
  const [showEditReviewForm, setShowEditReviewForm] = useState(false)

  // Menu Dropdown State
  const [showEditReview, setShowEditReview] = useState<{ index: number; isOpen: boolean }>({
    index: -1,
    isOpen: false,
  })

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

  // Fetch reviews - Dùng useCallback & useEffect để tránh lỗi re-render vô tận
  const fetchReviews = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/products/${productId}/reviews`)
      if (response.ok) {
        const reviewData = await response.json()
        setReviews(reviewData)
        setCountReviews(reviewData.length)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    }
  }, [productId])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  // Xử lý Xóa Review
  const handleRemoveReview = async (reviewId: number) => {
    setShowEditReview({ index: -1, isOpen: false }) // Đóng popup menu
    setDeletingId(reviewId) // Bật hiệu ứng loading cho card review này

    try {
      const response = await fetch(`http://localhost:8080/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        showNotification({
          message: 'Xóa đánh giá thành công',
          type: 'SUCCESS',
          duration: 3000,
        })

        // Cập nhật state nội bộ ngay lập tức
        setReviews((prev) => prev.filter((r) => r.reviewId !== reviewId))
        setCountReviews((prev) => prev - 1)
      } else {
        showNotification({
          message: 'Xóa đánh giá thất bại',
          type: 'ERROR',
          duration: 3000,
        })
      }
    } catch (error) {
      console.error('Error deleting review:', error)
      showNotification({
        message: 'Có lỗi xảy ra khi xóa đánh giá',
        type: 'ERROR',
        duration: 3000,
      })
    } finally {
      setDeletingId(null) // Tắt loading
    }
  }

  // Xử lý hành động Xem thêm / Thu gọn
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + REVIEWS_PER_PAGE)
  }

  const handleCollapse = () => {
    setVisibleCount(REVIEWS_PER_PAGE)
  }

  // Cắt danh sách đánh giá hiển thị theo `visibleCount`
  const visibleReviews = reviews.slice(0, visibleCount)
  const hasMoreReviews = visibleCount < reviews.length

  return (
    <div className="reviews bg-white p-6 shadow-sm rounded-2xl border border-gray-100">
      {/* TỔNG QUAN ĐÁNH GIÁ */}
      <div className="review_summary bg-teal-50/60 border border-teal-100 rounded-2xl p-4 mb-6 flex items-center justify-between">
        <h2 className="text-green-900 text-base font-bold uppercase tracking-wide">
          Tổng quan đánh giá
        </h2>
        <span className="text-teal-800 font-medium bg-teal-100/80 px-3 py-1 rounded-full text-sm">
          Số lượng: {countReviews}
        </span>
      </div>

      {/* DANH SÁCH REVIEW */}
      <div className="reviews-list space-y-4">
        {visibleReviews.length > 0 ? (
          visibleReviews.map((review) => {
            const isDeleting = deletingId === review.reviewId

            return (
              <div
                key={review.reviewId}
                className={`review-item relative grid grid-cols-3 border-l-4 border-emerald-500 p-4 rounded-2xl shadow-sm bg-white transition-all duration-300 ${
                  isDeleting ? 'opacity-60 pointer-events-none' : 'hover:shadow-md'
                }`}
              >
                {/* HIỆU ỨNG LOADING KHI XÓA REVIEW NÀY */}
                {isDeleting && (
                  <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] rounded-2xl z-20 flex items-center justify-center gap-2 text-emerald-800 font-medium">
                    <svg
                      className="animate-spin h-5 w-5 text-emerald-600"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
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
                    <span>Đang xóa đánh giá...</span>
                  </div>
                )}

                {/* THÔNG TIN NỘI DUNG */}
                <div className="col-span-2">
                  <div className="review-header flex items-center mb-1">
                    <span className="review-customer font-semibold text-gray-800 mr-2">
                      {review.customerName}
                    </span>
                  </div>
                  <div className="review-rating flex items-center mb-2">
                    {Array.from({ length: review.reviewRating }, (_, index) => (
                      <Star
                        key={index}
                        className="text-yellow-400 fill-yellow-400 w-4 h-4 mr-0.5"
                      />
                    ))}
                  </div>
                  <p className="review-content text-gray-600 text-sm leading-relaxed">
                    {review.reviewContent}
                  </p>
                </div>

                {/* HÌNH ẢNH REVIEW */}
                <div className="col-span-1 hidden lg:flex flex-col items-end justify-center pr-6">
                  <div className="reviewImages flex items-center justify-center gap-2">
                    {review.reviewImages &&
                      review.reviewImages.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt="Review attachment"
                          className="h-16 w-16 border border-emerald-100 rounded-xl object-cover shadow-sm"
                        />
                      ))}
                  </div>
                </div>

                {/* TÙY CHỌN (CHỈ DÀNH CHO CHỦ ĐÁNH GIÁ) */}
                {customerData?.userId === review.customerId && (
                  <div className="review-options absolute top-3 right-3 z-10">
                    <button
                      type="button"
                      className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                      onClick={() =>
                        setShowEditReview({
                          index: review.reviewId,
                          isOpen:
                            showEditReview.index === review.reviewId
                              ? !showEditReview.isOpen
                              : true,
                        })
                      }
                    >
                      <EllipsisVertical size={18} />
                    </button>

                    {/* POPUP MENU */}
                    {showEditReview.index === review.reviewId && showEditReview.isOpen && (
                      <div className="absolute top-8 right-0 bg-white p-1.5 rounded-xl shadow-xl border border-gray-100 min-w-[150px] z-30">
                        <button
                          type="button"
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2 cursor-pointer transition-colors"
                          onClick={() => {
                            setShowEditReview({ index: -1, isOpen: false })
                            setIsOpenModal(true)
                            setSelectedReview(review)
                            setShowEditReviewForm(true)
                          }}
                        >
                          Chỉnh sửa
                        </button>
                        <button
                          type="button"
                          className="w-full text-left px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 flex items-center gap-2 cursor-pointer transition-colors"
                          onClick={() => handleRemoveReview(review.reviewId)}
                        >
                          Xóa đánh giá
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })
        ) : (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            Chưa có đánh giá nào cho sản phẩm này.
          </div>
        )}
      </div>

      {/* KHU VỰC THÔNG TIN & CÁC NÚT HÀNH ĐỘNG PHÍA DƯỚI */}
      <div className="mt-8 flex flex-col items-center gap-3">
        {/* Chỉ số đếm số lượng đang xem */}
        {reviews.length > 0 && (
          <span className="text-xs font-medium text-gray-400 tracking-wide">
            Đang hiển thị {Math.min(visibleCount, reviews.length)} / {reviews.length} đánh giá
          </span>
        )}

        <div className="flex items-center justify-center gap-3 flex-wrap">
          {/* NÚT XEM THÊM / THU GỌN */}
          {hasMoreReviews ? (
            <button
              type="button"
              onClick={handleLoadMore}
              className="inline-flex items-center gap-2 bg-white border border-emerald-500 px-5 py-2.5 rounded-xl text-emerald-600 font-medium 
                         hover:bg-emerald-50 active:scale-95 transition-all cursor-pointer shadow-sm text-sm"
            >
              <span>Xem thêm đánh giá</span>
              <ChevronDown size={16} />
            </button>
          ) : reviews.length > REVIEWS_PER_PAGE ? (
            <button
              type="button"
              onClick={handleCollapse}
              className="inline-flex items-center gap-2 bg-gray-50 border border-gray-300 px-5 py-2.5 rounded-xl text-gray-600 font-medium 
                         hover:bg-gray-100 active:scale-95 transition-all cursor-pointer shadow-sm text-sm"
            >
              <span>Thu gọn</span>
              <ChevronUp size={16} />
            </button>
          ) : null}

          {/* NÚT THÊM ĐÁNH GIÁ */}
          <button
            type="button"
            onClick={handleAddReview}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium 
                       active:scale-95 transition-all cursor-pointer shadow-sm text-sm"
          >
            Thêm đánh giá
          </button>
        </div>
      </div>

      {/* MODAL THÊM / SỬA ĐÁNH GIÁ (Căn giữa viewport) */}
      {isOpenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop mờ nền */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpenModal(false)}
          />

          {/* Container bọc Modal */}
          <div className="relative w-full max-w-xl z-50">
            {showAddReviewForm && (
              <AddNewReviewModal
                onClose={onCloseAdd}
                productId={productId}
                onSuccess={fetchReviews}
              />
            )}
            {showEditReviewForm && selectedReview && (
              <EditReviewModal
                onClose={onCloseEdit}
                review={selectedReview}
                onSuccess={fetchReviews}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
