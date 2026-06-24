import { useLocation } from 'react-router-dom'

export default function ProductDetail() {
  const location = useLocation()

  const productId = location.pathname.split('/').pop() // Lấy productId từ URL

  console.log('Product ID:', productId) // In ra productId để kiểm tra

  return (
    <div className="page-cus_product-detail mt-14 min-h-screen bg-[#F8FFF4]">
      <header className="page_product-header py-6 text-left bg-white">
        <div className="max-w-7xl mx-auto px-3">
          <h1 className="text-3xl text-green-900 font-bold">Chi tiết sản phẩm</h1>
          <p className="text-sm text-green-700/60 mt-3">
            Khám phá thông tin chi tiết về sản phẩm thân thiện với môi trường
          </p>
        </div>
      </header>
      <main className="page_product-detail--content max-w-7xl mx-auto px-3 py-6">
        <div className="product-detail-info bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-green-900 mb-4">Tên sản phẩm</h2>
          <p className="text-green-700 mb-2">Mô tả sản phẩm: Đây là mô tả chi tiết về sản phẩm.</p>
          <p className="text-green-700 mb-2">Giá: 100.000 ₫</p>
          <p className="text-green-700 mb-2">Chỉ số carbon: 50</p>
          <p className="text-green-700 mb-2">Điểm Eco: 10</p>
          <button className="mt-4 px-4 py-2 bg-linear-to-r from-emerald-400 to-teal-600 text-white rounded-lg hover:from-emerald-500 hover:to-teal-700 transition-all">
            Thêm vào giỏ hàng
          </button>
        </div>
      </main>
    </div>
  )
}
