import { Search, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import type { CategoryResponse } from '../../model/product.model'

interface ProductFilterProps {
  searchValue: string
  setSearchValue: (value: string) => void

  selectedSortOption: number
  setSelectedSortOption: (value: number) => void

  fromPrice: number | null
  setFromPrice: (value: number | null) => void

  toPrice: number | null
  setToPrice: (value: number | null) => void

  selectedMinScore: number | null
  setSelectedMinScore: (value: number | null) => void

  selectedOrigin: string | null
  setSelectedOrigin: (value: string | null) => void

  categories: CategoryResponse[]
  selectedCategory: number | null
  setSelectedCategory: (value: number | null) => void
}

export default function ProductFilter({
  searchValue,
  setSearchValue,
  selectedSortOption,
  setSelectedSortOption,

  fromPrice,
  setFromPrice,
  toPrice,
  setToPrice,

  selectedMinScore,
  setSelectedMinScore,

  selectedOrigin,
  setSelectedOrigin,

  categories,
  selectedCategory,
  setSelectedCategory,
}: ProductFilterProps) {
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

  const [showFilters, setShowFilters] = useState(true)

  const [activeCategory, setActiveCategory] = useState<number | null>(-1)

  const searchByInputSearch = (value: string) => {
    setSearchValue(value)
  }

  return (
    <div className="productFilter">
      <div className="product_filter">
        <div className="product_filter-header flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search input */}
          <div className="product_filter--group relative flex items-center gap-2 flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchValue}
              onChange={(e) => searchByInputSearch(e.target.value)}
              className="product_filter-search pl-10 pt-3 pr-3 pb-3 border border-green-200 w-full rounded-2xl bg-white text-green-900 placeholder:text-green-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
            />
            <Search className="product_filter-search-icon text-green-500 h-5 w-5 absolute left-3 hover:cursor-pointer" />
          </div>

          {/* Hot filter */}
          <div className="product_filter--group relative flex items-center gap-2">
            <select
              name="hotFilter"
              id="hotFilter"
              value={selectedSortOption}
              onChange={(e) => setSelectedSortOption(Number(e.target.value))}
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
                  value={fromPrice !== null ? fromPrice : ''}
                  onChange={(e) => setFromPrice(e.target.value ? Number(e.target.value) : null)}
                  className="p-2 border border-green-200 w-full rounded-2xl bg-white text-green-900 placeholder:text-green-200 focus:outline-none focus:ring-1 focus:ring-emerald-400 transition-all"
                />
                -
                <input
                  type="number"
                  placeholder="Giá đến"
                  value={toPrice !== null ? toPrice : ''}
                  onChange={(e) => setToPrice(e.target.value ? Number(e.target.value) : null)}
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
                    onClick={() => {
                      if (selectedMinScore === s) {
                        setSelectedMinScore(null)
                      } else {
                        setSelectedMinScore(s)
                      }
                    }}
                    className={`px-3 py-1.5 text-xs font-semibold border border-green-200 rounded-lg text-green-700 
                      hover:bg-emerald-50 hover:border-emerald-300 transition-colors 
                      ${selectedMinScore === s ? 'bg-emerald-500 text-white hover:text-emerald-300' : ''}`}
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
                    onClick={() => {
                      if (selectedOrigin === origin.name) {
                        setSelectedOrigin(null)
                      } else {
                        setSelectedOrigin(origin.name)
                      }
                    }}
                    className={`px-3 py-1.5 text-xs font-semibold border border-green-200 rounded-lg text-green-700 
                      hover:bg-emerald-50 hover:border-emerald-300 transition-colors 
                      ${selectedOrigin === origin.name ? 'bg-emerald-500 text-white hover:text-emerald-300' : ''}`}
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
            selectedCategory === null
              ? 'bg-linear-to-r from-emerald-500 to-teal-600 text-white shadow-md'
              : 'bg-white border border-green-200 text-green-700 '
          }`}
          key={-1}
          onClick={() => setSelectedCategory(null)}
        >
          All
        </button>
        <div className="categories_list">
          {categories.map((category) => {
            return (
              <button
                className={`px-4 py-2 text-sm font-semibold rounded-xl hover:border-emerald-300 mr-3 ${
                  selectedCategory === category.categoryId
                    ? 'bg-linear-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                    : 'bg-white border border-green-200 text-green-700 '
                }`}
                key={category.categoryId}
                onClick={() => {
                  if (selectedCategory === category.categoryId) {
                    setSelectedCategory(null)
                  } else {
                    setSelectedCategory(category.categoryId)
                  }
                }}
              >
                {category.categoryName}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
