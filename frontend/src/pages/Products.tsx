import { useEffect, useMemo, useRef, useState } from 'react'
import type { CategoryResponse, ProductResponse } from '../model/product.model'
import ProductCard from '../components/product/ProductCard'
import ProductFilter from '../components/product/ProductFilter'
import Loading from '../components/Loading'

const PAGE_SIZE = 8

export default function Products() {
  const [products, setProducts] = useState<ProductResponse[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [filteredProducts, setFilteredProducts] = useState<ProductResponse[]>([])
  const [totalPages, setTotalPages] = useState(1)

  const [searchValue, setSearchValue] = useState<string>('')

  const [selectedSortOption, setSelectedSortOption] = useState<number>(-1)

  const [fromPrice, setFromPrice] = useState<number | null>(null)
  const [toPrice, setToPrice] = useState<number | null>(null)

  const [selectedMinScore, setSelectedMinScore] = useState<number | null>(null)

  const [selectedOrigin, setSelectedOrigin] = useState<string | null>(null)

  const [categories, setCategoriesList] = useState<CategoryResponse[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  // Chay moi lan load trang
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)

      try {
        const response = await fetch(`http://localhost:8080/api/products`)

        if (response.ok) {
          const responseData = await response.json()
          setProducts(responseData)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setIsLoading(false)
      }
    }

    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/categories')
        if (response.ok) {
          const categoriesData = await response.json()
          setCategoriesList(categoriesData)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    const getCountProducts = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/products/count')
        if (response.ok) {
          const countData = await response.json()

          setTotalPages(Math.max(1, Math.ceil(countData / PAGE_SIZE))) // Assuming the API returns the total number of products
        }
      } catch (error) {
        console.error('Error fetching product count:', error)
      }
    }

    getCountProducts()
    fetchCategories()
    fetchProducts()
  }, [])

  // SEARCH INPUT
  const resultFilter = useMemo(() => {
    // FILTER BY SEARCH VALUE
    let filtered = products.filter(
      (product) => product.productName.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1
    )

    // FILTER BY PRICE RANGE
    filtered = filtered.filter((product) => {
      const productPrice = product.productPrice
      if (fromPrice !== null && productPrice < fromPrice) {
        return false
      }
      if (toPrice !== null && productPrice > toPrice) {
        return false
      }
      return true
    })

    // FILTER BY MIN SCORE
    filtered = filtered.filter((product) => {
      if (selectedMinScore !== null && product.baseEcoPoints < selectedMinScore) {
        return false
      }
      return true
    })

    // FILTER BY ORIGIN
    filtered = filtered.filter((product) => {
      if (selectedOrigin !== null && product.original !== selectedOrigin) {
        return false
      }
      return true
    })

    // FILTER BY CATEGORY
    filtered = filtered.filter((product) => {
      if (selectedCategory !== null && product.categoryId !== selectedCategory) {
        return false
      }
      return true
    })

    // SORT BY SELECTED OPTION
    switch (selectedSortOption) {
      case 1:
        return [...filtered].sort((a, b) => b.productPrice - a.productPrice)
      case 2:
        return [...filtered].sort((a, b) => a.productPrice - b.productPrice)
      case 3:
        return [...filtered].sort((a, b) => b.baseEcoPoints - a.baseEcoPoints)
      case 4:
        return [...filtered].sort((a, b) => a.baseEcoPoints - b.baseEcoPoints)
      default:
        return filtered
    }
  }, [
    products,
    searchValue,
    selectedSortOption,
    fromPrice,
    toPrice,
    selectedMinScore,
    selectedOrigin,
    selectedCategory,
  ])

  // PAGINATION
  useEffect(() => {
    const paginationProducts = () => {
      const startIndex = (currentPage - 1) * PAGE_SIZE
      const endIndex = startIndex + PAGE_SIZE
      setFilteredProducts(resultFilter.slice(startIndex, endIndex))
    }

    paginationProducts()

    const updateTotalPages = () => {
      setCurrentPage(1) // Reset current page to 1 when filters change
      setTotalPages(Math.max(1, Math.ceil(resultFilter.length / PAGE_SIZE)))
    }

    updateTotalPages()
  }, [resultFilter, currentPage])

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
        <ProductFilter
          selectedSortOption={selectedSortOption}
          setSelectedSortOption={setSelectedSortOption}

          searchValue={searchValue}
          setSearchValue={setSearchValue}

          fromPrice={fromPrice}
          setFromPrice={setFromPrice}
          toPrice={toPrice}
          setToPrice={setToPrice}

          selectedMinScore={selectedMinScore}
          setSelectedMinScore={setSelectedMinScore}

          selectedOrigin={selectedOrigin}
          setSelectedOrigin={setSelectedOrigin}

          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        {/* Product List */}
        <div className="product_list--grid mt-6 text-left relative">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.productId} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-green-700 text-sm">Không có sản phẩm nào</p>
          )}

          {isLoading ? (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center backdrop-blur-sm rounded-2xl">
              <div className="w-10 h-10 mb-4 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="font-semibold text-green-900">Đang tải sản phẩm...</p>
            </div>
          ) : null}
        </div>
        {/* HIEN THI SO LUONG */}
        <div className="product_list--count text-sm text-green-700/60 mt-3 text-right">
          {filteredProducts.length > 0 ? (
            <p>
              Hiển thị <span className="font-semibold">{filteredProducts.length}</span> /
              <span className="font-semibold">{resultFilter.length}</span> sản phẩm
            </p>
          ) : (
            <p>Không có sản phẩm nào</p>
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
          {Array.from({ length: totalPages }, (_, index) => {
            return (
              <button
                key={index + 1}
                className={`product--slide-btn rounded-2xl bg-white py-2 px-3 border border-green-200 text-green-700 hover:bg-emerald-50 hover:border-emerald-300 transition-colors disabled:cursor-not-allowed
                  ${currentPage === index + 1 ? 'bg-linear-to-r from-emerald-500 to-teal-600 text-white' : ''}`}
                onClick={() => setCurrentPage(index + 1)}
                disabled={isLoading || currentPage === index + 1}
              >
                {index + 1}
              </button>
            )
          })}

          <button
            onClick={() => setCurrentPage((page) => page + 1)}
            disabled={currentPage === totalPages || isLoading}
            className="product--slide-btn rounded-2xl bg-white py-2 px-3 border border-green-200 text-green-700 hover:bg-emerald-50 hover:border-emerald-300 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </main>
    </div>
  )
}
