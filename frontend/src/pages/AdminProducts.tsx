import { useCallback, useEffect, useRef, useState } from 'react'
import { Input, Select, Spin, Popconfirm, Pagination } from 'antd'
import {
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ShopOutlined,
} from '@ant-design/icons'
import { Package } from 'lucide-react'
import type { CategoryResponse, ProductResponse } from '../model/product.model'
import AdmAddProduct from '../components/admin/AdmAddProduct'
import AdmProductDetail from '../components/admin/AdmProductDetail'
import AdmEditProduct from '../components/admin/AdmEditProduct'
import { useNotification } from '../context/useNotification'

const API = 'http://localhost:8080/api/admin'

const formatCurrency = (value: number) =>
  Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)

export default function AdminProducts() {
  const token = localStorage.getItem('token') ?? ''
  const { showNotification } = useNotification()

  const [products, setProducts] = useState<ProductResponse[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [categories, setCategories] = useState<CategoryResponse[]>([])
  const [loading, setLoading] = useState(false)

  const [searchQuery, setSearchQuery] = useState('')
  // const debouncedRef = useRef<NodeJS.Timeout | null>()
  const debouncedRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [keyword, setKeyword] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<boolean | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  const [showAddProduct, setShowAddProduct] = useState(false)
  const [showEditProduct, setShowEditProduct] = useState(false)
  const [showProductDetail, setShowProductDetail] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ProductResponse | null>(null)

  // ---- fetch categories (once) ----
  useEffect(() => {
    if (!token) return
    let cancelled = false
    fetch(`${API}/categories`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => { if (!cancelled) setCategories(data) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [token])

  // ---- debounce search ----
  const onSearchChange = useCallback((value: string) => {
    setSearchQuery(value)
    clearTimeout(debouncedRef.current)
    debouncedRef.current = setTimeout(() => setKeyword(value), 400)
  }, [])

  // ---- reset page on filter change ----
  const prevRef = useRef({ keyword, selectedCategory, selectedStatus })
  useEffect(() => {
    const prev = prevRef.current
    if (prev.keyword !== keyword || prev.selectedCategory !== selectedCategory || prev.selectedStatus !== selectedStatus) {
      setCurrentPage(1)
      prevRef.current = { keyword, selectedCategory, selectedStatus }
    }
  }, [keyword, selectedCategory, selectedStatus])

  // ---- fetch products (all params → backend handles everything) ----
  useEffect(() => {
    if (!token) return
    const controller = new AbortController()
    setLoading(true)

    const params = new URLSearchParams({ page: String(currentPage), limit: String(pageSize) })
    if (keyword) params.set('keyword', keyword)
    if (selectedCategory != null) params.set('categoryId', String(selectedCategory))
    if (selectedStatus != null) params.set('statusSale', String(selectedStatus))

    fetch(`${API}/products?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((json) => {
        setProducts(json.data ?? [])
        setTotalItems(json.total ?? 0)
      })
      .catch((e) => { if (e.name !== 'AbortError') console.error(e) })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })

    return () => controller.abort()
  }, [token, currentPage, keyword, selectedCategory, selectedStatus])

  // ---- handlers ----
  const handleRefresh = useCallback(() => {
    setSearchQuery('')
    setKeyword('')
    setSelectedCategory(null)
    setSelectedStatus(null)
    setCurrentPage(1)
  }, [])

  const removeProduct = useCallback(async (productId: number) => {
    try {
      const res = await fetch(`${API}/products/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        showNotification({ message: 'Xóa sản phẩm thành công', type: 'SUCCESS', duration: 3000 })
        setProducts((prev) => {
          const next = prev.filter((p) => p.productId !== productId)
          if (next.length === 0 && currentPage > 1) setCurrentPage((p) => p - 1)
          return next
        })
        setTotalItems((t) => t - 1)
      } else {
        showNotification({ message: 'Xóa sản phẩm thất bại', type: 'ERROR', duration: 3000 })
      }
    } catch {
      showNotification({ message: 'Xóa sản phẩm thất bại', type: 'ERROR', duration: 3000 })
    }
  }, [token, showNotification, currentPage])

  const openDetail = useCallback((product: ProductResponse) => {
    setSelectedProduct(product)
    setTimeout(() => setShowProductDetail(true), 0)
  }, [])

  const openEdit = useCallback((product: ProductResponse) => {
    setSelectedProduct(product)
    setTimeout(() => setShowEditProduct(true), 0)
  }, [])

  const closeModal = useCallback(() => {
    setShowAddProduct(false)
    setShowEditProduct(false)
    setShowProductDetail(false)
    setSelectedProduct(null)
  }, [])

  const handleEditSaved = useCallback((updated: ProductResponse) => {
    setProducts((prev) => prev.map((p) => (p.productId === updated.productId ? updated : p)))
    closeModal()
  }, [closeModal])

  const handleAddSaved = useCallback((product: ProductResponse) => {
    setProducts((prev) => [product, ...prev])
    setTotalItems((t) => t + 1)
    closeModal()
  }, [closeModal])

  const statusBadge = useCallback((statusSale: boolean) => (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${
      statusSale ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60' : 'bg-gray-100 text-gray-600 ring-1 ring-gray-200/60'
    }`}>
      {statusSale ? 'Đang bán' : 'Ngừng bán'}
    </span>
  ), [])

  const totalPages = Math.ceil(totalItems / pageSize)

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-5 lg:space-y-6">

        {/* HEADER */}
        <header className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4 sm:px-6 sm:py-5 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400" />
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-5">
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-600 bg-clip-text text-transparent tracking-tight">
                Quản lý sản phẩm
              </h1>
              <p className="text-sm text-gray-400 mt-0.5 truncate">Quản lý tất cả sản phẩm trong hệ thống</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={handleRefresh} disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-emerald-200 bg-emerald-50 text-sm font-medium text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300 active:bg-emerald-200 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                <ReloadOutlined className={`text-sm ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Làm mới</span>
              </button>
              <button onClick={() => setShowAddProduct(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-sm font-medium text-white shadow-sm shadow-emerald-500/25 hover:shadow-md hover:shadow-emerald-500/30 active:bg-emerald-600 transition-all duration-150 cursor-pointer">
                <PlusOutlined className="text-sm" />
                <span className="hidden sm:inline">Thêm sản phẩm</span>
                <span className="sm:hidden">Thêm</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <Input placeholder="Tìm theo tên sản phẩm..." prefix={<SearchOutlined className="text-emerald-400" />}
              allowClear value={searchQuery} onChange={(e) => onSearchChange(e.target.value)}
              className="hover:border-emerald-300 focus-within:border-emerald-400 focus-within:shadow-[0_0_0_2px_rgba(16,185,129,0.1)]" />
            <Select allowClear placeholder="Loại sản phẩm" value={selectedCategory}
              onChange={(v) => setSelectedCategory(v ?? null)}
              options={categories.map((c) => ({ value: c.categoryId, label: c.categoryName }))}
              className="w-full" />
            <Select allowClear placeholder="Trạng thái bán" value={selectedStatus ?? undefined}
              onChange={(v) => setSelectedStatus(v ?? null)}
              options={[{ value: true, label: 'Đang bán' }, { value: false, label: 'Ngừng bán' }]}
              className="w-full" />
          </div>
        </header>

        {/* TABLE */}
        <main className="bg-white rounded-2xl shadow-sm border border-emerald-100/60 overflow-hidden">
          <Spin spinning={loading} size="medium">
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border-b border-emerald-100/60">
                    <th className="px-4 py-3 text-left text-xs font-bold text-emerald-800 uppercase tracking-wider">#</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-emerald-800 uppercase tracking-wider">Sản phẩm</th>
                    <th className="px-4 py-3 text-right text-xs font-bold text-emerald-800 uppercase tracking-wider">Giá</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-emerald-800 uppercase tracking-wider">Carbon</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-emerald-800 uppercase tracking-wider">Kho</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-emerald-800 uppercase tracking-wider">Trạng thái</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-emerald-800 uppercase tracking-wider hidden lg:table-cell">Loại</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-emerald-800 uppercase tracking-wider">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100/80">
                  {products.length === 0 && !loading && (
                    <tr><td colSpan={8} className="py-16 text-center text-gray-400">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                          <Package className="text-emerald-400" size={28} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-500">Không có sản phẩm</p>
                          <p className="text-sm text-gray-400 mt-0.5">Thử thay đổi bộ lọc tìm kiếm</p>
                        </div>
                      </div>
                    </td></tr>
                  )}
                  {products.map((product, index) => (
                    <tr key={product.productId} className="hover:bg-emerald-50/30 transition-colors duration-150">
                      <td className="px-4 py-3 text-sm text-gray-500">{(currentPage - 1) * pageSize + index + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3 min-w-0">
                          {product.productImage ? (
                            <img src={product.productImage} alt={product.productName}
                              className="w-10 h-10 rounded-lg object-cover flex-shrink-0 ring-1 ring-gray-100" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center flex-shrink-0">
                              <ShopOutlined className="text-emerald-400" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">{product.productName}</p>
                            <p className="text-xs text-gray-400 lg:hidden">{product.categoryName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-900 whitespace-nowrap text-sm">{formatCurrency(product.productPrice)}</td>
                      <td className="px-4 py-3 text-center text-sm">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">{product.productCarbonIndex}</span>
                      </td>
                      <td className="px-4 py-3 text-center text-sm">
                        <span className={`font-medium ${product.inventory <= 10 ? 'text-red-500' : 'text-gray-700'}`}>{product.inventory}</span>
                      </td>
                      <td className="px-4 py-3 text-center">{statusBadge(product.statusSale)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell">{product.categoryName}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => openDetail(product)} title="Xem chi tiết"
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-amber-600 hover:bg-amber-50 hover:text-amber-700 transition-colors duration-150 cursor-pointer">
                            <EyeOutlined size={16} />
                          </button>
                          <button onClick={() => openEdit(product)} title="Chỉnh sửa"
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-150 cursor-pointer">
                            <EditOutlined size={16} />
                          </button>
                          <Popconfirm title="Xóa sản phẩm" description="Bạn có chắc chắn muốn xóa sản phẩm này?"
                            onConfirm={() => removeProduct(product.productId)} okText="Xóa" cancelText="Huỷ" okType="danger">
                            <button title="Xóa"
                              className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors duration-150 cursor-pointer">
                              <DeleteOutlined size={16} />
                            </button>
                          </Popconfirm>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-gray-100">
              {products.length === 0 && !loading && (
                <div className="py-16 text-center text-gray-400">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mb-3">
                    <Package className="text-emerald-400" size={28} />
                  </div>
                  <p className="font-semibold text-gray-500">Không có sản phẩm</p>
                  <p className="text-sm text-gray-400 mt-0.5">Thử thay đổi bộ lọc tìm kiếm</p>
                </div>
              )}
              {products.map((product) => (
                <div key={product.productId} className="px-4 py-3.5 active:bg-emerald-50/50 transition-colors">
                  <div className="flex items-start gap-3">
                    {product.productImage ? (
                      <img src={product.productImage} alt={product.productName}
                        className="w-14 h-14 rounded-xl object-cover flex-shrink-0 ring-1 ring-gray-100" />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center flex-shrink-0">
                        <ShopOutlined className="text-emerald-400 text-lg" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-gray-900 truncate">{product.productName}</p>
                        {statusBadge(product.statusSale)}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{product.categoryName}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-bold text-emerald-700">{formatCurrency(product.productPrice)}</span>
                        <div className="flex items-center gap-1">
                          <button onClick={() => openDetail(product)} className="w-7 h-7 rounded-lg flex items-center justify-center text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer">
                            <EyeOutlined size={14} />
                          </button>
                          <button onClick={() => openEdit(product)} className="w-7 h-7 rounded-lg flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer">
                            <EditOutlined size={14} />
                          </button>
                          <Popconfirm title="Xóa sản phẩm?" onConfirm={() => removeProduct(product.productId)} okText="Xóa" cancelText="Huỷ" okType="danger">
                            <button className="w-7 h-7 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors cursor-pointer">
                              <DeleteOutlined size={14} />
                            </button>
                          </Popconfirm>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                        <span>Kho: <b className={product.inventory <= 10 ? 'text-red-500' : 'text-gray-600'}>{product.inventory}</b></span>
                        <span>Carbon: <b className="text-emerald-600">{product.productCarbonIndex}</b></span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-6 py-4 border-t border-emerald-100/60">
                <span className="text-sm text-gray-500">
                  Trang <b>{currentPage}</b> / <b>{totalPages}</b> — <b>{totalItems}</b> sản phẩm
                </span>
                <Pagination current={currentPage} total={totalItems} pageSize={pageSize}
                  showSizeChanger={false} size="small" onChange={(page) => setCurrentPage(page)} />
              </div>
            )}
          </Spin>
        </main>
      </div>

      {/* MODALS */}
      <AdmAddProduct open={showAddProduct} onClose={closeModal} onSaved={handleAddSaved} categories={categories} />
      <AdmProductDetail product={selectedProduct!} open={showProductDetail && !!selectedProduct} onClose={closeModal} />
      <AdmEditProduct open={showEditProduct && !!selectedProduct} onClose={closeModal} onSaved={handleEditSaved} categories={categories} selectedProduct={selectedProduct!} />
    </div>
  )
}
