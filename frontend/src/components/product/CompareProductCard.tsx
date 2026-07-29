import { X } from 'lucide-react'
import type { ProductResponse } from '../../model/product.model'

interface CompareProductCardProps {
  product: ProductResponse
  removeProduct: (productId: number) => void
}

export default function CompareProductCard({ product, removeProduct }: CompareProductCardProps) {
  return (
    <div className="compare-product-card bg-white rounded-2xl p-3 border-l-4 border border-green-200 w-fit relative">
      <div className="flex items-center">
        <img
          src={product.imageUrls[0] || '/placeholder-image.png'}
          alt={product.productName}
          className="w-16 h-16 object-cover rounded-lg mr-4"
        />
        <div>
          <h4 className="text-sm font-bold text-gray-800">{product.productName}</h4>
        </div>
      </div>
      <X
        className="absolute top-2 right-2 w-4 h-4 text-gray-400 cursor-pointer"
        onClick={() => removeProduct(product.productId)}
      />
    </div>
  )
}
