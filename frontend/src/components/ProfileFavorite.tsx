import { useEffect, useState } from 'react'
import type { ProductResponse } from '../model/product.model'
import ProductCard from './product/ProductCard'

type FavoriteProduct = {
  productId: number
  username: string
}

export default function ProfileFavorite() {
  const [favoriteProducts, setFavoriteProducts] = useState<ProductResponse[]>([])

  const [isLoading, setIsLoading] = useState(true) // State to track loading status

  const token = localStorage.getItem('token') // Get the token from local storage
  useEffect(() => {
    const fetchProduct = async (productId: number) => {
      try {
        const response = await fetch(`http://localhost:8080/api/products/${productId}`)
        if (response.ok) {
          return await response.json()
        }
      } catch (error) {
        console.error(`Error fetching product with ID ${productId}:`, error)
      }
    }

    // Fetch favorite products from an API or local storage
    const fetchFavoriteProducts = async () => {
      setIsLoading(true) // Set loading to true before fetching
      try {
        const response = await fetch('http://localhost:8080/api/favorite-products', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Include the token in the request headers
          },
        })
        const data: FavoriteProduct[] = await response.json() // Replace with your API endpoint

        console.log('Fetched favorite products:', data) // Log the fetched data for debugging

        const productPromises = data.map(async (favorite) => {
          return await fetchProduct(favorite.productId)
        })

        const productDataArray = await Promise.all(productPromises)
        setFavoriteProducts(productDataArray.filter((v): v is ProductResponse => !!v))
      } catch (error) {
        console.error('Error fetching favorite products:', error)
      } finally {
        setIsLoading(false) // Set loading to false after fetching (success or error)
      }
    }
    fetchFavoriteProducts()
  }, [token])

  return (
    <div className="profile-favorite text-left">
      <header className="border-b border-green-100 pb-4 pt-2 px-3 mb-4 text-left flex items-center justify-between">
        <h2 className="text-xl font-bold text-green-900">Quản lý sản phẩm yêu thích</h2>
      </header>
      <ul className=" relative">
        {favoriteProducts.length === 0 ? (
          <p>Không có sản phẩm yêu thích nào.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {favoriteProducts.map((product) => (
              <div className="shadow-md overflow-hidden rounded-2xl" key={product.productId}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        {isLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center backdrop-blur-sm rounded-2xl">
            <div className="w-10 h-10 mb-4 border-4 border-green-500 border-t-transparent rounded-full animate-spin mt-7"></div>
            <p className="font-semibold text-green-900">Đang tải danh sách...</p>
          </div>
        )}
      </ul>
    </div>
  )
}
