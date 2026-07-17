import { Heart, Leaf, Sprout } from 'lucide-react'
import type { ProductResponse } from '../../model/product.model'
import { useNavigate } from 'react-router-dom'
import { useCustomer } from '../../context/useCustomer'
import { useNotification } from '../../context/useNotification'
import { useEffect, useState } from 'react'

interface ProductCardProps {
  product: ProductResponse
}

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate()

  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const storedToken = () => {
      const token = localStorage.getItem('token')
      if (token) {
        setToken(token)
      }
    }

    storedToken()
  }, [])

  const [isFavorite, setIsFavorite] = useState(false)

  const { showNotification } = useNotification()

  const handleViewDetail = (productId: number) => {
    navigate(`/products/${productId}`)
  }

  useEffect(() => {
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

    if (token) {
      checkFavoriteProduct(product.productId)
    }
  }, [product.productId, token])

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
    <div
      className="product_card bg-[#F8FFF4] group rounded-3xl shadow-sm shadow-emerald-100/40 overflow-hidden hover:scale-102 hover:shadow-md hover:shadow-emerald-100/80 transition-all duration-200 cursor-pointer"
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
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center 
          justify-center hover:text-emerald-600 transition-all shadow-sm hover:cursor-pointer hover:scale-110"
          onClick={(e) => {
            e.preventDefault()
            addFavoriteProduct(product.productId)
          }}
        >
          <Heart className="w-4 h-4" fill={isFavorite ? 'red' : 'white'} />
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
