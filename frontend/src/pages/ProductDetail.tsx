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

  const [isFavorite, setIsFavorite] = useState(false)

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

    // check favorite product
    const checkFavoriteProduct = async (productId: number) => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/favorite-products/product/${productId}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        if (response.ok) {
          setIsFavorite(true)
        }
      } catch (error) {
        console.error('Error checking favorite product:', error)
      }
    }

    fetchProduct()
    // fetchImageProduct()
    checkFavoriteProduct(Number(productId))

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

  const addFavoriteProduct = async (productId: number) => {
    const token = localStorage.getItem('token')
    if (!token) {
      showNotification({
        message: 'Vui lòng đăng nhập để thêm sản phẩm yêu thích',
        type: 'WARNING',
        duration: 3000,
      })
      return
    }

    if (isFavorite) {
      setIsFavorite(false)

      try {
        const response = await fetch(
          `http://localhost:8080/api/favorite-products/product/${productId}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        if (response.ok) {
          showNotification({
            message: 'Xóa sản phẩm yêu thích thành công',
            type: 'SUCCESS',
            duration: 3000,
          })
        }
      } catch (error) {
        console.error('Error removing favorite product:', error)
        showNotification({
          message: 'Xóa sản phẩm yêu thích thất bại',
          type: 'ERROR',
          duration: 3000,
        })
        setIsFavorite(true)
      }
    } else {
      setIsFavorite(true)

      try {
        const response = await fetch('http://localhost:8080/api/favorite-products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId }),
        })

        if (response.ok) {
          showNotification({
            message: 'Thêm sản phẩm yêu thích thành công',
            type: 'SUCCESS',
            duration: 3000,
          })
        }
      } catch (error) {
        console.error('Error adding favorite product:', error)
        showNotification({
          message: 'Thêm sản phẩm yêu thích thất bại',
          type: 'ERROR',
          duration: 3000,
        })
        setIsFavorite(false)
      }
    }
  }

  return (
    <div className="page-cus_product-detail mt-14 min-h-screen bg-[#F8FFF4] text-left overflow-x-hidden">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4">
        <nav className="text-sm text-green-700 flex flex-wrap items-center">
          <Link to="/" className="hover:text-green-900">
            Trang chủ
          </Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-green-900">
            Sản phẩm
          </Link>
          <span className="mx-2">/</span>
          <span className="text-green-900 font-medium truncate max-w-40 sm:max-w-none">
            {product ? product.productName : 'Chi tiết sản phẩm'}
          </span>
        </nav>
      </div>

      {/* Product detail content */}
      {product ? (
        <div className="xl:max-w-7xl lg:max-w-5xl md:max-w-3xl sm:max-w-md max-w-sm mx-auto px-4 py-2 pb-12 sm:pb-16">
          {/* Product Information */}
          <div className="grid xs:grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <aside className="product_detail--image flex justify-center lg:justify-start min-w-0">
              <div className=" max-w-[320px] sm:max-w-105 lg:max-w-105 mx-auto lg:mx-0">
                <div className="rounded-3xl overflow-hidden bg-green-100 aspect-square sm:aspect-4/3 mb-3">
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

                <div className="grid grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
                  {product.imageUrls?.map((url, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImg(index)}
                      className={`rounded-xl sm:rounded-2xl overflow-hidden aspect-square border-2 transition-all 
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

            <main className="product_detail-main min-w-0 flex flex-col gap-5 sm:gap-6">
              {/* Badge */}
              <header className="flex flex-wrap items-center gap-2">
                <div className="bg-emerald-50 border border-emerald-100 text-xs px-3 py-1.5 font-semibold rounded-full text-emerald-700 max-w-full truncate">
                  {product.categoryName}
                </div>

                <div className="flex items-center bg-emerald-100 border border-emerald-100 text-xs px-3 py-1.5 font-semibold rounded-full text-emerald-700 whitespace-nowrap">
                  <Leaf className="mr-1 w-4 h-4 shrink-0" />
                  {product.productCarbonIndex} kgCO₂e
                </div>

                <div className="flex items-center bg-emerald-200 border border-emerald-100 text-xs px-3 py-1.5 font-semibold rounded-full text-emerald-800 whitespace-nowrap">
                  <Sprout className="mr-1 w-4 h-4 shrink-0" />
                  {product.baseEcoPoints} Eco Points
                </div>
              </header>

              {/* Product Name */}
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-green-900 break-words">
                  {product.productName}
                </h1>

                <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                  <span className="text-yellow-500">★★★★★</span>
                  <span>{countReviews ? `${countReviews} đánh giá` : 'Chưa có đánh giá'}</span>
                </div>
              </div>

              {/* Promotion */}
              <div className="w-full rounded-2xl border border-emerald-100 bg-white p-4 sm:p-5 shadow-sm">
                <h3 className="mb-3 text-base sm:text-lg font-semibold text-amber-500">
                  Khuyến mãi
                </h3>

                <ul className="space-y-2">
                  {contentSale.map((sale) => (
                    <li key={sale.id} className="flex items-start text-sm text-gray-600 leading-6">
                      <ChessKing className="mr-2 mt-0.5 w-4 h-4 shrink-0 text-amber-500" />
                      <span className="min-w-0">{sale.content}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price */}
              <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:gap-4 min-w-0">
                <span className="text-base text-gray-600 shrink-0">Giá:</span>

                <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-500 ">
                  {product.productPrice?.toLocaleString()} VNĐ
                </span>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-4">
                <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                  <button
                    onClick={() => addToCart(product.productId)}
                    className="flex w-full items-center justify-center rounded-2xl min-h-13 border border-emerald-400 bg-white px-4 text-sm sm:text-base font-semibold text-green-900 transition-all duration-300 hover:bg-emerald-500 hover:text-white"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5 shrink-0" />
                    Thêm vào giỏ hàng
                  </button>

                  <button
                    onClick={() => addFavoriteProduct(product.productId)}
                    className="flex w-full items-center justify-center min-h-13 rounded-2xl border border-emerald-400 bg-white px-4 text-sm sm:text-base font-semibold text-green-900 transition-all duration-300 hover:bg-emerald-500 hover:text-white"
                  >
                    <Heart className="mr-2 h-5 w-5 shrink-0" fill={isFavorite ? 'red' : 'white'} />
                    Thêm vào yêu thích
                  </button>
                </div>

                <button className="flex w-full items-center min-h-13 justify-center rounded-2xl bg-linear-to-r from-emerald-400 to-teal-600 px-4 text-sm sm:text-base font-bold text-white transition-all duration-300 hover:from-emerald-500 hover:to-teal-700">
                  <Zap className="mr-2 h-5 w-5 shrink-0" />
                  Mua ngay
                </button>
              </div>
            </main>
          </div>

          {/* Products Description */}
          <h2 className="text-green-900 text-lg font-semibold mb-3 sm:mb-4 mt-8 lg:mt-10">
            Thông tin sản phẩm
          </h2>
          <div className="product_infor--plus bg-white border border-emerald-100 rounded-2xl p-4 mb-5">
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed mt-2 break-words">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed blanditiis, optio, porro
              rem quaerat labore quas quibusdam voluptates harum eveniet, aut velit? Omnis aliquam
              id quidem tempora aut dolore facilis?
            </p>
          </div>

          {/* Products Suggestion */}
          <div className="product_suggest-list">
            <h2 className="text-lg font-semibold mb-3 sm:mb-4 text-green-900">
              Sản phẩm liên quan
            </h2>
            <ProductCardSuggest products={suggestProducts} />
          </div>

          {/* Products Reviews */}
          <div className="product_reviews mt-5">
            <h2 className="text-lg font-semibold mb-3 sm:mb-4 text-green-900">Đánh giá sản phẩm</h2>

            <ProductReview productId={product.productId} />
          </div>
        </div>
      ) : (
        <p className="text-green-700 text-sm px-4">Sản phẩm không tồn tại</p>
      )}
    </div>
  )
}
