import { ArrowLeft, ArrowRight, Leaf, Sparkles, Sprout } from 'lucide-react'
import type { ProductRecommendation } from '../../model/product.model'
import { useNavigate } from 'react-router-dom'
import { useRef } from 'react'

interface ProductCardProps {
  product: ProductRecommendation
}

export default function ProductCardSuggest({ product }: ProductCardProps) {
  const navigate = useNavigate()
  const trackRef = useRef<HTMLDivElement | null>(null)
  const scrollAmount = 320

  const handleViewDetail = (productId: number) => {
    console.log('Navigating to product detail:', productId)
    navigate(`/products/${productId}`)
  }

  const handleScroll = (direction: 'left' | 'right') => {
    if (!trackRef.current) return

    trackRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  return (
    <div className="relative bg-white p-4 sm:p-5 shadow rounded-2xl">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-green-900 text-base sm:text-lg font-semibold leading-tight">
            Bạn có thể thích
          </p>
          <p className="text-xs text-gray-400 mt-0.5">Gợi ý riêng dựa trên sản phẩm bạn đang xem</p>
        </div>

        {/* Trên mobile ẩn nút mũi tên, dùng vuốt/snap-scroll; từ sm trở lên mới hiện nút */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => handleScroll('left')}
            className="inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-emerald-200 bg-white text-emerald-700 shadow-sm transition-all hover:border-emerald-400 hover:bg-emerald-50 hover:cursor-pointer"
            aria-label="Cuộn sản phẩm gợi ý sang trái"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleScroll('right')}
            className="inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-emerald-200 bg-white text-emerald-700 shadow-sm transition-all hover:border-emerald-400 hover:bg-emerald-50 hover:cursor-pointer"
            aria-label="Cuộn sản phẩm gợi ý sang phải"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="relative">
        {/* Dải mờ 2 bên gợi ý có thể vuốt ngang */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-3 w-6 sm:w-10 bg-linear-to-r from-white to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-3 w-6 sm:w-10 bg-linear-to-l from-white to-transparent z-10" />

        <div
          ref={trackRef}
          className="scrollbar-hide flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth pb-3 snap-x snap-mandatory"
        >
          {product && product.recommendations ? (
            product.recommendations.map((rec) => (
              <div
                className="product_card bg-[#F8FFF4] group min-w-55 max-w-55 sm:min-w-65 sm:max-w-65 lg:min-w-75 lg:max-w-75 rounded-2xl sm:rounded-3xl overflow-hidden border border-emerald-100 hover:scale-[1.02] hover:shadow-md hover:shadow-emerald-100/60 transition-all duration-200 cursor-pointer snap-start shrink-0"
                key={rec.productId}
              >
                <div className="product_card--image h-40 sm:h-48 lg:h-52 overflow-hidden bg-emerald-100 relative">
                  <img
                    alt={rec.productName}
                    className="product-img object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    src={rec.imageUrl || '/default-image.jpg'}
                  />

                  <div className="text-xs sm:text-sm text-white font-semibold absolute top-2 left-2 bg-linear-to-r from-emerald-400 to-teal-600 px-2.5 sm:px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                    <Sprout className="w-4 h-4 shrink-0" /> {rec.baseEcoPoints} Eco
                  </div>

                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-emerald-700 text-[11px] sm:text-xs font-semibold shadow-sm">
                    <Leaf className="w-3.5 h-3.5 shrink-0" />
                    {rec.productCarbonIndex} kgCO₂e
                  </div>
                </div>

                <div className="product_card--content p-3.5 sm:p-4 flex flex-col gap-2">
                  {rec.categoryName && (
                    <span className="self-start bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full truncate max-w-full">
                      {rec.categoryName}
                    </span>
                  )}

                  <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-green-900 leading-snug line-clamp-1">
                    {rec.productName}
                  </h3>

                  {rec.matchReason && (
                    <div className="flex items-start gap-1.5 bg-emerald-50/70 border border-emerald-100 rounded-xl px-2.5 py-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <p className="text-[11px] sm:text-xs text-emerald-700 leading-snug line-clamp-2">
                        {rec.matchReason}
                      </p>
                    </div>
                  )}

                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-emerald-600 mt-1">
                    {rec.productPrice.toLocaleString('vi-VN')} ₫
                  </p>

                  <button
                    onClick={() => handleViewDetail(rec.productId)}
                    className="product_card-btn min-h-11 flex items-center justify-center text-sm sm:text-base text-white bg-linear-to-r from-emerald-400 to-teal-600 rounded-2xl sm:rounded-3xl mt-1 hover:from-emerald-500 hover:to-teal-600 hover:cursor-pointer w-full transition-colors"
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm sm:text-base">Không có sản phẩm gợi ý.</p>
          )}
        </div>
      </div>
    </div>
  )
}
