import { Heart, Leaf, Sprout } from 'lucide-react'
import type { ProductIntroduce, ProductResponse } from '../../model/product.model'
import { useNavigate } from 'react-router-dom'

interface ProductCardProps {
  product: ProductResponse
}

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate()

  const handleViewDetail = (productId: number) => {
    navigate(`/products/${productId}`)
  }

  return (
    <div
      className="product_card bg-[#F8FFF4] group rounded-3xl overflow-hidden hover:scale-102 hover:shadow-md hover:shadow-emerald-100/60 transition-all duration-200 cursor-pointer"
      key={product.productId}
    >
      <div className="product_card--image h-52 overflow-hidden bg-green-100 relative">
        <img
          src={product.imageUrls[0] || '/hero.png'}
          alt={product.productName}
          className="product-img object-cover w-full h-full hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        <button
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-green-400 hover:text-emerald-600 transition-all shadow-sm "
          onClick={(e) => e.preventDefault()}
        >
          <Heart className="w-4 h-4" />
        </button>

        <div className="text-sm text-white font-semibold absolute top-2 left-2 bg-linear-to-r from-emerald-400 to-teal-600 px-3 py-1 rounded-full flex items-center gap-2 shadow-md">
          <Sprout className="w-5 h-5" /> {product.baseEcoPoints} Eco
        </div>
      </div>
      <div className="product_card--content p-3">
        <h2 className="text-sm text-green-800 uppercase mb-2">{product.categoryName}</h2>
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
}
