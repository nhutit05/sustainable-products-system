import { ArrowLeft, ArrowRight, Leaf, Sprout } from 'lucide-react'
import type { ProductDetail, ProductIntroduce } from '../model/product.model'
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
    <div className="relative bg-white p-4 shadow rounded-2xl">
      <div className="mb-4 flex items-center justify-between gap-2">
        <p className="text-gray-800 text-md font-semibold">Bạn có thể thích</p>
        <div className="">
          <button
            type="button"
            onClick={() => handleScroll('left')}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-emerald-200 bg-white text-emerald-700 shadow-sm transition-all hover:border-emerald-400 hover:bg-emerald-50 hover:cursor-pointer"
            aria-label="Cuộn sản phẩm gợi ý sang trái"
          >
            <span className="text-xl leading-none">
              <ArrowLeft className="w-4 h-4" />
            </span>
          </button>
          <button
            type="button"
            onClick={() => handleScroll('right')}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-emerald-200 bg-white text-emerald-700 shadow-sm transition-all hover:border-emerald-400 hover:bg-emerald-50 hover:cursor-pointer"
            aria-label="Cuộn sản phẩm gợi ý sang phải"
          >
            <span className="text-xl leading-none">
              <ArrowRight className="w-4 h-4" />
            </span>
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="scrollbar-hide flex gap-6 overflow-x-auto scroll-smooth pb-3 snap-x snap-mandatory"
      >
        {productsData.map((product) => {
          return (
            <div
              className="product_card bg-[#F8FFF4] group min-w-[260px] max-w-[260px] sm:min-w-[280px] sm:max-w-[280px] lg:min-w-[300px] lg:max-w-[300px] rounded-3xl overflow-hidden border border-emerald-100 hover:scale-[1.02] hover:shadow-md hover:shadow-emerald-100/60 transition-all duration-200 cursor-pointer snap-start shrink-0"
              key={product.productId}
            >
              <div className="product_card--image h-52 overflow-hidden bg-green-100 relative">
                <img
                  alt={product.productName}
                  className="product-img object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                  src={product.productImage || ''}
                />

                <div className="text-sm text-white font-semibold absolute top-2 left-2 bg-linear-to-r from-emerald-400 to-teal-600 px-3 py-1 rounded-full flex items-center gap-2 shadow-md">
                  <Sprout className="w-5 h-5" /> {product.baseEcoPoints} Eco
                </div>
              </div>
              <div className="product_card--content p-3">
                <h3 className="text-lg font-semibold text-green-900 mb-2 line-clamp-1">
                  {product.productName}
                </h3>
                <p className="text-2xl font-bold text-emerald-600 relative">
                  {product.productPrice.toLocaleString('vi-VN')} ₫
                  <span className="text-lg absolute bottom-0 right-2 flex items-center gap-2 bg-teal-50 px-3 rounded-full">
                    <Leaf className="w-4 h-4" />
                    {product.productCarbonIndex}
                  </span>
                </p>
                <button
                  onClick={() => handleViewDetail(product.productId)}
                  className="product_card-btn text-white bg-linear-to-r from-emerald-400 to-teal-600 p-2 rounded-3xl mt-2 hover:from-emerald-500 hover:to-teal-600 hover:cursor-pointer w-full"
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
