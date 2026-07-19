import { ArrowLeft, ArrowRight, Leaf, Sprout } from 'lucide-react'
import type { ProductDetail, ProductIntroduce } from '../../model/product.model'
import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'

interface ProductCardProps {
  products: ProductDetail[]
}

export default function ProductCardSuggest({ products }: ProductCardProps) {
  const navigate = useNavigate()
  const trackRef = useRef<HTMLDivElement | null>(null)
  const [productsData, setProductsData] = useState<ProductIntroduce[]>([])
  const scrollAmount = 320

  useEffect(() => {
    const fetchProductImage = async () => {
      try {
        const productsIntroduce = await Promise.all(
          products.map(async (product) => {
            const response = await fetch(
              `http://localhost:8080/api/products/${product.productId}/images`
            )

            const imageData = await response.json()

            return {
              ...product,
              productImage: imageData?.length > 0 ? imageData[0].imageUrl : null,
            }
          })
        )
        setProductsData(productsIntroduce)
      } catch (error) {
        console.error('Error fetching product images:', error)
      }
    }

    fetchProductImage()
  }, [products])

  const handleViewDetail = (productId: number) => {
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
        <p className="text-green-900 text-base sm:text-lg font-semibold">Bạn có thể thích</p>

        {/* Trên mobile ẩn nút mũi tên, dùng vuốt/snap-scroll; từ sm trở lên mới hiện nút */}
        <div className="hidden sm:flex items-center gap-2">
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

      <div
        ref={trackRef}
        className="scrollbar-hide flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth pb-3 snap-x snap-mandatory"
      >
        {productsData.map((product) => {
          return (
            <div
              className="product_card bg-[#F8FFF4] group min-w-[220px] max-w-[220px] sm:min-w-[260px] sm:max-w-[260px] lg:min-w-[300px] lg:max-w-[300px] rounded-2xl sm:rounded-3xl overflow-hidden border border-emerald-100 hover:scale-[1.02] hover:shadow-md hover:shadow-emerald-100/60 transition-all duration-200 cursor-pointer snap-start shrink-0"
              key={product.productId}
            >
              <div className="product_card--image h-40 sm:h-48 lg:h-52 overflow-hidden bg-green-100 relative">
                <img
                  alt={product.productName}
                  className="product-img object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                  src={product.productImage || ''}
                />

                <div className="text-xs sm:text-sm text-white font-semibold absolute top-2 left-2 bg-linear-to-r from-emerald-400 to-teal-600 px-2.5 sm:px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                  <Sprout className="w-4 h-4 shrink-0" /> {product.baseEcoPoints} Eco
                </div>
              </div>
              <div className="product_card--content p-3">
                <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-green-900 mb-2 line-clamp-1">
                  {product.productName}
                </h3>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-emerald-600 relative pr-16 sm:pr-20">
                  {product.productPrice.toLocaleString('vi-VN')} ₫
                  <span className="text-xs sm:text-sm absolute bottom-0.5 right-0 flex items-center gap-1 bg-teal-50 px-2 sm:px-3 py-0.5 rounded-full whitespace-nowrap">
                    <Leaf className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                    {product.productCarbonIndex}
                  </span>
                </p>
                <button
                  onClick={() => handleViewDetail(product.productId)}
                  className="product_card-btn min-h-[44px] flex items-center justify-center text-sm sm:text-base text-white bg-linear-to-r from-emerald-400 to-teal-600 rounded-2xl sm:rounded-3xl mt-2 hover:from-emerald-500 hover:to-teal-600 hover:cursor-pointer w-full"
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
