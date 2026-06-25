import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import type { ProductDetail, ProductImage } from '../model/product'
import { ChessKing, Leaf, ShoppingCart, Sprout, Zap } from 'lucide-react'

export default function ProductDetail() {
  const location = useLocation()

  const productId = location.pathname.split('/').pop() // Lấy productId từ URL

  const [product, setProduct] = useState<ProductDetail | null>(null)

  const [listImage, setListImage] = useState<ProductImage[]>([])

  const [activeImg, setActiveImg] = useState(0)

  const [countReviews, setCountReviews] = useState(0)

  const contentSale = [
    {
      id: 1,
      content: 'Giảm 100.000 đ cho đơn hàng từ 10.000.000 đ khi thanh toán VNPAY',
    },
    {
      id: 2,
      content: 'Giảm thêm 2% khi thanh toán cùng có giá trị cao hơn',
    },
    {
      id: 3,
      content: 'Miễn phí vận chuyển cho đơn hàng từ 5.000.000 đ',
    },
  ]

  useEffect(() => {
    const fetchImageProduct = async () => {
      try {
        const reponse = await fetch(`http://localhost:8080/api/products/${productId}/images`)
        if (reponse.ok) {
          const imageData = await reponse.json()
          imageData.sort((a: ProductImage, b: ProductImage) => a.productImageId - b.productImageId)
          if (imageData && imageData.length > 0) {
            setListImage(() => [...imageData])
          }
        }
      } catch (error) {
        console.error(`Error fetching image for product ${productId}:`, error)
      }
    }

    const getCountReviews = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/products/${productId}/reviews/count`
        )
        if (response.ok) {
          const data = await response.json()
          setCountReviews(data.count)
        }
      } catch (error) {
        console.error('Error fetching review count:', error)
      }
    }

    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/products/${productId}`)
        if (response.ok) {
          const data = await response.json()
          setProduct(data)
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      }
    }

    fetchProduct()
    fetchImageProduct()
    getCountReviews()
  }, [productId])

  return (
    <div className="page-cus_product-detail mt-14 min-h-screen bg-[#F8FFF4] text-left">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-3 py-4">
        <nav className="text-sm text-green-700">
          <Link to="/" className="hover:text-green-900">
            Trang chủ
          </Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-green-900">
            Sản phẩm
          </Link>
          <span className="mx-2">/</span>
          <span className="text-green-900 font-medium">
            {product ? product.productName : 'Chi tiết sản phẩm'}
          </span>
        </nav>
      </div>

      {/* Product detail content */}
      {product ? (
        <div className="max-w-7xl mx-auto px-3 py-2 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 mb-6">
            <aside className="product_detail--image pl-3">
              <div>
                <div className="rounded-3xl overflow-hidden bg-green-100 mb-2 aspect-4/3">
                  <img
                    src={listImage.length > 0 ? listImage[activeImg].imageUrl : ''}
                    alt={product.productName}
                    className="w-full h-full object-cover transition-all duration-300"
                  />
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {listImage.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`rounded-2xl overflow-hidden aspect-square border-2 transition-all 
                      ${activeImg === i ? 'border-emerald-500 shadow-md' : 'border-transparent hover:border-green-300'}`}
                    >
                      <img
                        src={img.imageUrl}
                        alt={`View ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            <main className="product_detail-main">
              <header className="py-2 flex items-center gap-3 mb-6">
                <div className="bg-emerald-50 border border-emerald-100 text-xs px-2 py-1 font-semibold rounded-2xl text-emerald-700 max-h-fit">
                  {product.categoryName}
                </div>

                <div className="bg-emerald-100 border border-emerald-100 text-xs px-2 py-1 font-semibold rounded-2xl text-emerald-700 max-h-fit">
                  <Leaf className="inline-block mr-1" size={16} />
                  {product.productCarbonIndex} kgCO2e
                </div>

                <div className="bg-emerald-200 border border-emerald-100 text-xs px-2 py-1 font-semibold rounded-2xl text-emerald-800 max-h-fit">
                  <Sprout className="inline-block mr-1" size={16} />
                  {product.baseEcoPoints} kgCO2e
                </div>
              </header>

              <div className="">
                <div className="h2 text-3xl font-bold text-green-900 mb-2">
                  {product.productName}
                </div>
                <p className="text-sm text-gray-500 my-4">
                  {countReviews ? `${countReviews} ` : 'chưa có'} đánh giá
                </p>
                <div className="p-4 bg-white border border-emerald-100 rounded-2xl mt-4 w-fit">
                  <h3 className="font-semibold text-lg text-amber-300 mb-2">Khuyến mãi</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {contentSale.map((sale) => (
                      <li key={sale.id} className="text-sm text-gray-600">
                        <ChessKing className="inline-block mr-2 text-amber-500" size={16} />
                        {sale.content}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center text-xl text-green-900 gap-6 my-6">
                  Giá gốc:
                  <span className="text-3xl font-bold text-red-500">
                    {product.productPrice?.toLocaleString()} VNĐ
                  </span>
                </div>

                <div className="product_detail-button  mt-6 w-full">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <button className="text-white font-bold px-4 py-3 rounded-2xl bg-linear-to-r from-emerald-400 to-teal-600 hover:from-emerald-500 hover:to-teal-600 hover:cursor-pointer transition-all duration-200">
                      <ShoppingCart className="inline-block mr-2" size={20} />
                      Thêm vào giỏ hàng
                    </button>

                    <button className=" text-green-900 font-bold px-4 py-3 rounded-2xl  border border-emerald-400 hover:bg-emerald-500 hover:text-white hover:cursor-pointer transition-all duration-200">
                      <Zap className="inline-block mr-2" size={20} />
                      Mua ngay
                    </button>
                  </div>

                  <button className="w-full text-green-900 font-bold px-4 py-3 rounded-2xl  border border-emerald-400 hover:bg-emerald-500 hover:text-white hover:cursor-pointer transition-all duration-200">
                    <Zap className="inline-block mr-2" size={20} />
                    Mua ngay
                  </button>
                </div>
              </div>
            </main>
          </div>
        </div>
      ) : (
        <p className="text-green-700 text-sm">Sản phẩm không tồn tại</p>
      )}
    </div>
  )
}
