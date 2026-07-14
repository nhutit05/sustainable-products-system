import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import type { ProductDetail, ProductImage, ProductResponse } from '../model/product.model'
import { ChessKing, Heart, Leaf, ShoppingCart, Sprout, Zap } from 'lucide-react'
import ProductCardSuggest from '../components/product/ProductCardSuggest'
import type { Cart } from '../model/cart.model'
import { useNotification } from '../context/useNotification'
import ProductReview from '../components/product/ProductReview'
export default function ProductDetail() {
  const location = useLocation()

  const navigate = useNavigate()

  const productId = location.pathname.split('/').pop() // Lấy productId từ URL

  const [product, setProduct] = useState<ProductResponse | null>(null)

  const [listImage, setListImage] = useState<string[]>(product?.imageUrls || [])

  const [activeImg, setActiveImg] = useState(0)

  const countReviews = 0

  // Danh sach san pham goi y => lay tam tu products
  const [suggestProducts, setSuggestProducts] = useState<ProductDetail[]>([])

  const [cart, setCart] = useState<Cart | null>(null)

  const token = localStorage.getItem('token')

  const locationPath = location.pathname

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

  const { showNotification } = useNotification()

  useEffect(() => {
    // Lay hinh anh san pham tu productId
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

    // Lay thong tin chi tiet san pham tu productId
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

    // fetch tam toan bo product
    const fetchSuggestProducts = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/products`)
        if (response.ok) {
          const data = await response.json()
          setSuggestProducts(data)
        }
      } catch (error) {
        console.error('Error fetching suggest products:', error)
      }
    }

    // Lay cartId
    const fetchCart = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/cart', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (response.ok) {
          const data = await response.json()
          setCart(data)
        }
      } catch (error) {
        console.error('Error fetching cart:', error)
      }
    }

    fetchProduct()
    fetchImageProduct()

    // fetch tam toan bo product de goi y
    fetchSuggestProducts()
    // Lay cartId
    fetchCart()
  }, [productId, token])

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }, [locationPath]) // Scroll to top when pathname changes

  // Add to cart
  const addToCart = async (productId: number) => {
    if (cart && token) {
      try {
        const data = {
          cartId: cart.cartId,
          productId: productId,
          quantity: 1,
        }

        const response = await fetch('http://localhost:8080/api/cart-items', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        })

        if (response.ok) {
          showNotification({
            message: 'Sản phẩm đã được thêm vào giỏ hàng thành công!',
            type: 'SUCCESS',
            duration: 3000,
          })
        } else {
          showNotification({
            message: 'Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.',
            type: 'ERROR',
            duration: 3000,
          })

          navigate(`/products/${productId}`)
        }
      } catch (error) {
        console.error('Error adding product to cart:', error)
      }
    }
  }

  console.log('product', product)

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
          {/* Product Information */}
          <div className="grid lg:grid-cols-2 gap-12 mb-6">
            <aside className="product_detail--image pl-3">
              <div>
                <div className="rounded-3xl overflow-hidden bg-green-100 mb-2 aspect-4/3">
                  <img
                    src={
                      product.imageUrls && product.imageUrls.length > 0
                        ? product.imageUrls[activeImg]
                        : ''
                    }
                    alt={product.productName}
                    className="w-full h-full object-cover transition-all duration-300"
                  />
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {product.imageUrls?.map((url, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImg(index)}
                      className={`rounded-2xl overflow-hidden aspect-square border-2 transition-all 
                      ${activeImg === index ? 'border-emerald-500 shadow-md' : 'border-transparent hover:border-green-300'}`}
                    >
                      <img
                        src={url}
                        alt={`View ${index + 1}`}
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
                    <button
                      onClick={() => addToCart(product.productId)}
                      className="flex items-center justify-center text-green-900 font-bold px-4 py-3 rounded-2xl  border border-emerald-400 hover:bg-emerald-500 hover:text-white hover:cursor-pointer transition-all duration-200"
                    >
                      <ShoppingCart className="inline-block mr-2" size={20} />
                      Thêm vào giỏ hàng
                    </button>
                    <button className="flex items-center justify-center text-green-900 font-bold px-4 py-3 rounded-2xl  border border-emerald-400 hover:bg-emerald-500 hover:text-white hover:cursor-pointer transition-all duration-200">
                      <Heart className="inline-block mr-2" size={20} />
                      Thêm vào yêu thích
                    </button>
                  </div>

                  <button className="flex items-center w-full justify-center text-white font-bold px-4 py-3 rounded-2xl bg-linear-to-r from-emerald-400 to-teal-600 hover:from-emerald-500 hover:to-teal-600 hover:cursor-pointer transition-all duration-200">
                    <Zap className="inline-block mr-2" size={20} />
                    Mua ngay
                  </button>
                </div>
              </div>
            </main>
          </div>

          {/* Products Description */}
          <h2 className="text-green-900 text-lg font-semibold mb-4">Thông tin sản phẩm</h2>
          <div className="product_infor--plus bg-white border border-emerald-100 rounded-2xl p-3 mb-5">
            <p className="text-gray-500 text-md mt-2">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed blanditiis, optio, porro
              rem quaerat labore quas quibusdam voluptates harum eveniet, aut velit? Omnis aliquam
              id quidem tempora aut dolore facilis?
            </p>
          </div>

          {/* Products Suggestion */}
          <div className="product_suggest-list">
            <h2 className="text-lg font-semibold mb-4 text-green-900">Sản phẩm liên quan</h2>
            <ProductCardSuggest products={suggestProducts} />
          </div>

          {/* Products Reviews */}
          <div className="product_reviews mt-5">
            <h2 className="text-lg font-semibold mb-4 text-green-900">Đánh giá sản phẩm</h2>

            <ProductReview productId={product.productId} />
          </div>
        </div>
      ) : (
        <p className="text-green-700 text-sm">Sản phẩm không tồn tại</p>
      )}
    </div>
  )
}
