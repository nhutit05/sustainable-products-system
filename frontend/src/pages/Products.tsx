import { Search, SlidersHorizontal } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { ProductDetail, ProductImage, ProductIntroduce } from '../model/product.model'
import ProductCard from '../components/ProductCard'

const PAGE_SIZE = 8

export default function Products() {
  const hotFilters = [
    {
      id: 1,
      name: 'Giá: từ cao đến thấp',
    },
    {
      id: 2,
      name: 'Giá: từ thấp đến cao',
    },
    {
      id: 3,
      name: 'Eco Score: từ cao đến thấp',
    },
    {
      id: 4,
      name: 'Eco Score: từ thấp đến cao',
    },
  ]

  const originals = [
    {
      id: 1,
      name: 'Việt Nam',
    },
    {
      id: 2,
      name: 'Nhật Bản',
    },
    {
      id: 3,
      name: 'Hàn Quốc',
    },
  ]

  const categories = [
    {
      id: 1,
      name: 'Thực phẩm',
    },
    {
      id: 2,
      name: 'Đồ gia dụng',
    },
    {
      id: 3,
      name: 'Thời trang',
    },
  ]

  const [products, setProducts] = useState<ProductIntroduce[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [hasNextPage, setHasNextPage] = useState(false)

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()

    const fetchImageProduct = async (productId: number) => {
      try {
        const reponse = await fetch(`http://localhost:8080/api/products/${productId}/images`, {
          signal: controller.signal,
        })
        if (reponse.ok) {
          const imageData = await reponse.json()
          imageData.sort((a: ProductImage, b: ProductImage) => a.productImageId - b.productImageId)
          if (imageData && imageData.length > 0) {
            return imageData[0].imageUrl
          }
        }
      } catch (error) {
        console.error(`Error fetching image for product ${productId}:`, error)
      }
    }

    const fetchProducts = async () => {
      setIsLoading(true)

      try {
        const response = await fetch(
          `http://localhost:8080/api/products?page=${currentPage}&limit=${PAGE_SIZE}`,
          {
            signal: controller.signal,
          }
        )

        if (response.ok) {
          const responseData = await response.json()
          const data: ProductDetail[] = Array.isArray(responseData)
            ? responseData
            : Array.isArray(responseData?.content)
              ? responseData.content
              : Array.isArray(responseData?.data)
                ? responseData.data
                : []

          const totalPages =
            typeof responseData?.totalPages === 'number'
              ? responseData.totalPages
              : typeof responseData?.totalPage === 'number'
                ? responseData.totalPage
                : null

          if (!isMounted) {
            return
          }

          setHasNextPage(totalPages !== null ? currentPage < totalPages : data.length === PAGE_SIZE)
          // setProducts(
          //   data.map((product: ProductDetail) => ({
          //     ...product,
          //     productImage: '',
          //     imageUrls: []
          //   }))
          // )

          setProducts(
  data.map((product) => ({
    ...product,
    productImage: product.imageUrls?.[0] ?? ''
  }))
)

          void Promise.all(
            data.map(async (product: ProductDetail) => {
              const imageUrl = await fetchImageProduct(product.productId)
              return { productId: product.productId, imageUrl }
            })
          ).then((imageResults) => {
            if (!isMounted) {
              return
            }

            const imageMap = new Map(
              imageResults
                .filter((item) => item.imageUrl)
                .map((item) => [item.productId, item.imageUrl] as const)
            )

            setProducts((currentProducts) =>
              currentProducts.map((product) => {
                const imageUrl = imageMap.get(product.productId)
                return imageUrl ? { ...product, productImage: imageUrl } : product
              })
            )
          })
        }
      } catch (error) {
        if (controller.signal.aborted) {
          return
        }
        console.error('Error fetching products:', error)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchProducts()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [currentPage])

  const [showFilters, setShowFilters] = useState(true)

  const [activeCategory, setActiveCategory] = useState<number | null>(-1)

  return (
    <div className="page-cus_products mt-14 min-h-screen bg-[#F8FFF4]">
      <header className="page_product-header py-6 text-left bg-white">
        <div className="max-w-7xl mx-auto px-3">
          <h1 className="text-3xl text-green-900 font-bold">Trung tâm mua sắm Eco</h1>
          <p className="text-sm text-green-700/60 mt-3">
            Khám phá các sản phẩm thân thiện với môi trường tại Trung tâm mua sắm Eco
          </p>
        </div>
      </header>

      <main className="page_product-main py-4 border-t border-green-200 bg-green-50/30 max-w-7xl mx-auto">
        <div className="product_filter">
          <div className="product_filter-header flex flex-col sm:flex-row gap-3 mb-6">
            {/* Search input */}
            <div className="product_filter--group relative flex items-center gap-2 flex-1">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="product_filter-search pl-10 pt-3 pr-3 pb-3 border border-green-200 w-full rounded-2xl bg-white text-green-900 placeholder:text-green-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
              />
              <Search className="product_filter-search-icon text-green-500 h-5 w-5 absolute left-3" />
            </div>

            {/* Hot filter */}
            <div className="product_filter--group relative flex items-center gap-2">
              <select
                name="hotFilter"
                id="hotFilter"
                className="p-3 border border-green-200 w-full rounded-2xl bg-white text-green-900 placeholder:text-green-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
              >
                <option value="">Sắp xếp</option>
                {hotFilters.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Show filters button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-3 rounded-2xl flex items-center gap-2 border border-green-200 ${
                showFilters ? 'bg-emerald-500  text-white' : 'bg-white text-green-900'
              }`}
            >
              Lọc sản phẩm
              <SlidersHorizontal
                className={`ml-2 h-5 w-5 text-green-500 ${showFilters ? 'text-white' : 'text-green-500'}`}
              />
            </button>

            {/* Filter */}
          </div>
          {showFilters && (
            <div className="product_header_filter--group bg-white border border-green-200 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="showFilters--group text-left">
                <h2 className="font-bold text-green-900 text-sm">Khoảng giá tiền</h2>
                <div className="showFilters--group--price flex items-center gap-3 mt-3 text-emerald-500">
                  <input
                    type="number"
                    placeholder="Giá từ"
                    className="p-2 border border-green-200 w-full rounded-2xl bg-white text-green-900 placeholder:text-green-200 focus:outline-none focus:ring-1 focus:ring-emerald-400 transition-all"
                  />
                  -
                  <input
                    type="number"
                    placeholder="Giá đến"
                    className="p-2 border border-green-200 w-full rounded-2xl bg-white text-green-900 placeholder:text-green-200 focus:outline-none focus:ring-1 focus:ring-emerald-400 transition-all"
                  />
                  VND
                </div>
              </div>

              {/* Min Eco points */}
              <div className="text-left">
                <p className="text-sm font-semibold text-green-800 mb-3">Min Eco Score</p>
                <div className="flex gap-2">
                  {[20, 30, 40].map((s) => (
                    <button
                      key={s}
                      className="px-3 py-1.5 text-xs font-semibold border border-green-200 rounded-lg text-green-700 hover:bg-emerald-50 hover:border-emerald-300 transition-colors"
                    >
                      {s}+
                    </button>
                  ))}
                </div>
              </div>

              {/* Nguồn gốc */}
              <div className="text-left">
                <p className="text-sm font-semibold text-green-800 mb-3">Nguồn gốc</p>
                <div className="flex gap-2">
                  {originals.map((origin) => (
                    <button
                      key={origin.id}
                      className="px-3 py-1.5 text-xs font-semibold border border-green-200 rounded-lg text-green-700 hover:bg-emerald-50 hover:border-emerald-300 transition-colors"
                    >
                      {origin.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* filter by category */}
        <div className="product_category_filter my-6 text-left flex items-center gap-3 flex-wrap">
          <button
            className={`px-4 py-2 text-sm font-semibold rounded-xl whitespace-nowrap hover:border-emerald-300 ${
              activeCategory === -1
                ? 'bg-linear-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                : 'bg-white border border-green-200 text-green-700 '
            }`}
            key={-1}
            onClick={() => setActiveCategory(-1)}
          >
            All
          </button>
          <div className="categories_list">
            {categories.map((category) => {
              return (
                <button
                  className={`px-4 py-2 text-sm font-semibold rounded-xl hover:border-emerald-300 ${
                    activeCategory === category.id
                      ? 'bg-linear-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                      : 'bg-white border border-green-200 text-green-700 '
                  }`}
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </button>
              )
            })}
          </div>
        </div>
        {/* Product List */}
        <div className="product_list--grid  mt-6 text-left">
          {products.length > 0 ? (
            <div className="grid grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard key={product.productId} product={product} />
              ))}
            </div>
          ) : isLoading ? (
            <p className="text-green-700 text-sm">Đang tải danh sách sản phẩm...</p>
          ) : (
            <p className="text-green-700 text-sm">Không có sản phẩm nào</p>
          )}
        </div>

        <div className="product_list--slide flex items-center justify-center gap-3 mt-6">
          <button
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={currentPage === 1 || isLoading}
            className="product--slide-btn rounded-2xl bg-white py-2 px-3 border border-green-200 text-green-700 hover:bg-emerald-50 hover:border-emerald-300 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <button
            className={`product--slide-btn rounded-2xl bg-white py-2 px-3 border border-green-200 text-green-700 hover:bg-emerald-50 hover:border-emerald-300 transition-colors 
              ${currentPage === 1 ? 'bg-linear-to-r from-emerald-500 to-teal-600 text-white' : ''}`}
            onClick={() => setCurrentPage(1)}
            disabled={isLoading}
          >
            1
          </button>
          {hasNextPage && (
            <button
              className={`product--slide-btn rounded-2xl bg-white py-2 px-3 border border-green-200 text-green-700 hover:bg-emerald-50 hover:border-emerald-300 transition-colors 
                ${currentPage === 2 ? 'bg-linear-to-r from-emerald-500 to-teal-600 text-white' : ''}`}
              onClick={() => setCurrentPage(2)}
              disabled={isLoading}
            >
              2
            </button>
          )}
          <button
            onClick={() => setCurrentPage((page) => page + 1)}
            disabled={!hasNextPage || isLoading}
            className="product--slide-btn rounded-2xl bg-white py-2 px-3 border border-green-200 text-green-700 hover:bg-emerald-50 hover:border-emerald-300 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </main>
    </div>
  )
}
