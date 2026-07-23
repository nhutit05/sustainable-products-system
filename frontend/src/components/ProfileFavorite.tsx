import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ProductResponse } from '../model/product.model'
import ProductCard from './product/ProductCard'
import { useNavigate } from 'react-router-dom'

type FavoriteProduct = {
  productId: number
  username: string
}

const PAGE_SIZE = 3

export default function ProfileFavorite() {
  const [favoriteProducts, setFavoriteProducts] = useState<ProductResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const navigate = useNavigate()

  const token = localStorage.getItem('token')

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

    const fetchFavoriteProducts = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch('http://localhost:8080/api/favorite-products', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Không thể tải danh sách sản phẩm yêu thích.')
        }

        const data: FavoriteProduct[] = await response.json()

        const productPromises = data.map(async (favorite) => {
          return await fetchProduct(favorite.productId)
        })

        const productDataArray = await Promise.all(productPromises)
        setFavoriteProducts(productDataArray.filter((v): v is ProductResponse => !!v))
      } catch (err) {
        console.error('Error fetching favorite products:', err)
        setError('Có lỗi xảy ra khi tải sản phẩm yêu thích. Vui lòng thử lại sau.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchFavoriteProducts()
  }, [token])

  const totalPages = Math.max(1, Math.ceil(favoriteProducts.length / PAGE_SIZE))

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return favoriteProducts.slice(start, start + PAGE_SIZE)
  }, [favoriteProducts, currentPage])

  const goToPage = (page: number) => {
    const clamped = Math.min(Math.max(page, 1), totalPages)
    setCurrentPage(clamped)
    document
      .getElementById('favorite-list-top')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Gọi bởi ProductCard ngay sau khi bỏ yêu thích thành công trên server.
  // Chỉ xoá khỏi state cục bộ — không refetch, không reload trang.
  const handleUnfavorite = useCallback((productId: number) => {
    setFavoriteProducts((prev) => prev.filter((p) => p.productId !== productId))
  }, [])

  const pageNumbers = useMemo(() => {
    const windowSize = 5
    let start = Math.max(1, currentPage - Math.floor(windowSize / 2))
    const end = Math.min(totalPages, start + windowSize - 1)
    start = Math.max(1, end - windowSize + 1)
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }, [currentPage, totalPages])

  return (
    <div className="profile-favorite text-left">
      <header
        id="favorite-list-top"
        className="border-b border-green-100 pb-4 pt-2 px-3 mb-6 flex items-center justify-between"
      >
        <div>
          <h2 className="text-xl font-bold text-green-900">Sản phẩm yêu thích</h2>
          {!isLoading && !error && (
            <p className="text-sm text-green-700/70 mt-0.5">
              {favoriteProducts.length > 0
                ? `${favoriteProducts.length} sản phẩm đã lưu`
                : 'Chưa có sản phẩm nào'}
            </p>
          )}
        </div>
      </header>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 px-1">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden shadow-sm border border-green-50 animate-pulse"
            >
              <div className="aspect-square bg-green-100/70" />
              <div className="p-3 space-y-2">
                <div className="h-3.5 bg-green-100/70 rounded-full w-4/5" />
                <div className="h-3.5 bg-green-100/70 rounded-full w-2/5" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <svg
              viewBox="0 0 24 24"
              className="w-7 h-7 text-red-500"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v4m0 4h.01M10.29 3.86l-8.18 14A2 2 0 004 21h16a2 2 0 001.89-3.14l-8.18-14a2 2 0 00-3.42 0z"
              />
            </svg>
          </div>
          <p className="font-semibold text-green-900 mb-1">Đã có lỗi xảy ra</p>
          <p className="text-sm text-green-700/70">{error}</p>
        </div>
      ) : favoriteProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div
            onClick={() => navigate('/products')}
            className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4 hover:scale-105 hover:rotate-1 transition-transform cursor-pointer"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-8 h-8 text-green-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21l-7.682-8.318a4.5 4.5 0 010-6.364z"
              />
            </svg>
          </div>
          <p className="font-semibold text-green-900 mb-1">Chưa có sản phẩm yêu thích</p>
          <p className="text-sm text-green-700/70 max-w-xs">
            Hãy khám phá cửa hàng và nhấn biểu tượng trái tim để lưu sản phẩm bạn thích vào đây.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 px-1">
            {paginatedProducts.map((product) => (
              <div
                className="group rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-green-50 transition-all duration-300 hover:-translate-y-1"
                key={product.productId}
              >
                <ProductCard product={product} onUnfavorite={handleUnfavorite} />
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <nav
              className="flex items-center justify-center gap-1.5 mt-8 mb-2"
              aria-label="Phân trang sản phẩm yêu thích"
            >
              <button
                type="button"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-green-100 text-green-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-green-50 transition-colors"
                aria-label="Trang trước"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {pageNumbers[0] > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => goToPage(1)}
                    className="w-9 h-9 rounded-full text-sm font-medium text-green-700 hover:bg-green-50 transition-colors"
                  >
                    1
                  </button>
                  {pageNumbers[0] > 2 && <span className="px-1 text-green-300">…</span>}
                </>
              )}

              {pageNumbers.map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => goToPage(page)}
                  aria-current={page === currentPage ? 'page' : undefined}
                  className={`w-9 h-9 rounded-full text-sm font-medium transition-colors ${
                    page === currentPage
                      ? 'bg-green-600 text-white shadow-sm'
                      : 'text-green-700 hover:bg-green-50'
                  }`}
                >
                  {page}
                </button>
              ))}

              {pageNumbers[pageNumbers.length - 1] < totalPages && (
                <>
                  {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                    <span className="px-1 text-green-300">…</span>
                  )}
                  <button
                    type="button"
                    onClick={() => goToPage(totalPages)}
                    className="w-9 h-9 rounded-full text-sm font-medium text-green-700 hover:bg-green-50 transition-colors"
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-green-100 text-green-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-green-50 transition-colors"
                aria-label="Trang sau"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  )
}
