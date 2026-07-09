import { CircleCheckBig, Eye, Search, SquarePenIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { ProductDetail, CategoryResponse, ProductResponse } from '../model/product.model'
import AdmAddProduct from '../components/AdmAddProduct'
import AdmProductDetail from '../components/AdmProductDetail'
import AdmEditProduct from '../components/AdmEditProduct'

export default function AdminProducts() {
  const [searchQuery, setSearchQuery] = useState<string>('')

  const token = localStorage.getItem('token')

  const [categories, setCategories] = useState<CategoryResponse[]>([])
  const [selectedCategory, setSelectedCategory] = useState<CategoryResponse | null>(null)

  const [products, setProducts] = useState<ProductResponse[]>([])

  const [currentPage, setCurrentPage] = useState<number>(1)

  //   MODAL
  const [isModalOpen, setIsModalOpen] = useState(false)
  // ADD PRODUCT
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [showEditProduct, setShowEditProduct] = useState(false)
  const [showProductDetail, setShowProductDetail] = useState(false)

  // SELECT PRODUCT
  const [selectedProduct, setSelectedProduct] = useState<ProductResponse | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/admin/categories', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        if (response.ok) {
          setCategories(await response.json())
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/admin/products?page=${currentPage}&limit=10`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )
        if (response.ok) {
          setProducts(await response.json())
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }
    if (token) {
      fetchCategories()
      fetchProducts()
    }
  }, [token, currentPage])
  return (
    <div className="adm_products px-4">
      <header className="product-header p-4 rounded-2xl shadow bg-white">
        <div className="flex items-center justify-between py-2">
          <h1 className="text-green-900 text-xl font-semibold pl-3">Quản lý sản phẩm</h1>
          <button
            onClick={() => {
              setIsModalOpen(true)
              setShowAddProduct(true)
            }}
            className="text-md font-semibold text-white bg-blue-500 rounded-xl hover:cursor-pointer hover:bg-blue-600 px-3 py-2"
          >
            Thêm sản phẩm
          </button>
        </div>
        <div className="grid grid-cols-12 gap-4">
          {/* SEARCH BAR PRODUCT */}
          <div className="search_group relative flex items-center gap-2 w-full col-span-4">
            <Search className="search_icon absolute left-3" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-3 pr-3 bg-gray-100 rounded-2xl  focus:outline-none focus:ring-1 focus:ring-emerald-200 w-full"
            />
          </div>

          {/* FILTERS */}
          <div className="filters_group flex items-center gap-4 justify-end col-span-5">
            <label htmlFor="categories" className="text-green-900 text-md font-semibold">
              Loại sản phẩm:
            </label>
            <select
              id="categories"
              value={selectedCategory?.categoryId ?? ''}
              onChange={(e) => {
                const category = categories.find((cat) => cat.categoryId === Number(e.target.value))
                setSelectedCategory(category || null)
              }}
              className="filter_select p-3 rounded-2xl bg-gray-100 focus:outline-none focus:ring-1 focus:ring-emerald-200"
            >
              <option value="">Tất cả</option>
              {categories.map((category) => {
                return (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.categoryName}
                  </option>
                )
              })}
            </select>
          </div>

          {/* STATUS SALE FILTER */}
          <div className="statusSale flex items-center gap-4 justify-end col-span-3">
            <label htmlFor="statusSale" className="text-green-900 text-md font-semibold">
              Trạng thái bán:
            </label>
            <select
              id="statusSale"
              className="filter_select p-3 rounded-2xl bg-gray-100 focus:outline-none focus:ring-1 focus:ring-emerald-200"
            >
              <option value="">Tất cả</option>
              <option value="true">Đang bán</option>
              <option value="false">Ngừng bán</option>
            </select>
          </div>
        </div>
      </header>

      {/* PRODUCTS LIST */}
      <main className="bg-white p-4 rounded-2xl shadow mt-4">
        <section className="order-list">
          <table className="w-full border border-gray-200 rounded-2xl">
            <thead className="bg-emerald-50/80">
              <tr>
                <th className="p-3 border-b border-gray-200 text-left">ID</th>
                <th className="p-3 border-b border-gray-200 text-left">Tên sản phẩm</th>
                <th className="p-3 border-b border-gray-200 text-left">Giá trị</th>
                <th className="p-3 border-b border-gray-200 text-left">Chỉ số Carbon</th>
                <th className="p-3 border-b border-gray-200 text-left">Số lượng</th>
                <th className="p-3 border-b border-gray-200 text-left">Trạng thái</th>
                <th className="p-3 border-b border-gray-200 text-left">Loại sản phẩm</th>
                <th className="p-3 border-b border-gray-200 text-left">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.productId} className="hover:bg-gray-100">
                  <td className="p-3 border-b border-gray-200">{product.productId}</td>
                  <td className="p-3 border-b border-gray-200">{product.productName}</td>
                  <td className="p-3 border-b border-gray-200">
                    {Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(product.productPrice)}
                  </td>
                  <td className="p-3 border-b border-gray-200">{product.productCarbonIndex}</td>
                  <td className="p-3 border-b border-gray-200">{product.inventory}</td>
                  <td
                    className={`p-3 border-b border-gray-200 ${product.statusSale ? 'text-green-500' : 'text-gray-500'}`}
                  >
                    {product.statusSale ? 'Đang bán' : 'Ngừng bán'}
                  </td>
                  <td className="p-3 border-b border-gray-200">{product.categoryName}</td>
                  <td className="p-3 border-b border-gray-200 text-lg font-bold flex items-center gap-2">
                    <Eye
                      onClick={() => {
                        setSelectedProduct(product)
                        setIsModalOpen(true)
                        setShowProductDetail(true)
                      }}
                      className="hover:cursor-pointer text-amber-500"
                      size={20}
                    />
                    <SquarePenIcon
                      onClick={() => {
                        setSelectedProduct(product)
                        setIsModalOpen(true)
                        setShowEditProduct(true)
                      }}
                      className="hover:cursor-pointer text-blue-600"
                      size={20}
                    />
                    <CircleCheckBig className="hover:cursor-pointer text-green-500" size={20} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* PAGINATION */}
        <section className="order-pagination mt-4 flex items-center justify-center gap-2">
          <button
            className="pagination-btn p-2 rounded-xl bg-gray-100 hover:bg-gray-200"
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Trước
          </button>
          <button
            onClick={() => setCurrentPage(1)}
            className={`pagination-btn p-2 rounded-xl  ${currentPage === 1 ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            1
          </button>
          <button
            onClick={() => setCurrentPage(2)}
            className={`pagination-btn p-2 rounded-xl  ${currentPage === 2 ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            2
          </button>
          <button
            onClick={() => setCurrentPage(3)}
            className={`pagination-btn p-2 rounded-xl  ${currentPage === 3 ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            3
          </button>
          <button
            className="pagination-btn p-2 rounded-xl bg-gray-100 hover:bg-gray-200"
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Sau
          </button>
        </section>
      </main>

      {/* MODAL */}
      {isModalOpen && (
        <div className="">
          <div className="fixed inset-0 bg-gray-300/50 blur-lg z-50"></div>
          <div className="fixed inset-0 max-w-4xl top-10  mx-auto z-51">
            {showAddProduct ? (
              <AdmAddProduct
                setIsModalOpen={setIsModalOpen}
                setShowAddProduct={setShowAddProduct}
                categories={categories}
              />
            ) : null}

            {/* Product Detail Modal */}
            {showProductDetail && selectedProduct && (
              <AdmProductDetail
                product={selectedProduct}
                setIsModalOpen={setIsModalOpen}
                setShowProduct={setShowProductDetail}
              />
            )}

            {/* Edit Product Modal */}
            {showEditProduct && selectedProduct && (
              <AdmEditProduct
                setIsModalOpen={setIsModalOpen}
                setShowEditProduct={setShowEditProduct}
                categories={categories}
                selectedProduct={selectedProduct}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
