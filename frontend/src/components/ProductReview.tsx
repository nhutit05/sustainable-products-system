import { Star } from 'lucide-react'

export default function ProductReview() {
  return (
    <div className="product_review mt-6">
      <h2 className="text-lg font-semibold mb-4">Đánh giá sản phẩm</h2>
      <div className="flex items-center mb-4">
        <div className="flex items-center gap-1">
          <Star className="text-amber-400" size={20} />
          <Star className="text-amber-400" size={20} />
          <Star className="text-amber-400" size={20} />
          <Star className="text-amber-400" size={20} />
          <Star className="text-gray-300" size={20} />
        </div>
        <span className="text-sm text-gray-500 ml-2">4.0/5</span>
      </div>
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1">
          <Star className="text-amber-400" size={20} />
          <span className="text-sm text-gray-500 ml-1">5</span>
        </div>
        <div className="flex items-center gap-1">
          <Star className="text-amber-400" size={20} />
          <span className="text-sm text-gray-500 ml-1">4</span>
        </div>
        <div className="flex items-center gap-1">
          <Star className="text-amber-400" size={20} />
          <span className="text-sm text-gray-500 ml-1">3</span>
        </div>
        <div className="flex items-center gap-1">
          <Star className="text-amber-400" size={20} />
          <span className="text-sm text-gray-500 ml-1">2</span>
        </div>
        <div className="flex items-center gap-1">
          <Star className="text-amber-400" size={20} />
          <span className="text-sm text-gray-500 ml-1">1</span>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-200"></div>
          <div>
            <p className="text-sm font-semibold">Nguyen Van A</p>
            <p className="text-sm text-gray-500">12/03/2023</p>
          </div>
        </div>
        <p className="text-sm text-gray-700">
          Sản phẩm rất tốt, chất lượng cao và giao hàng nhanh chóng. Tôi rất hài lòng với sản phẩm
          này.
        </p>
      </div>
    </div>
  )
}
