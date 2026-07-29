import { useEffect, useMemo, useState } from 'react'
import type { ProductResponse } from '../../model/product.model'
import CompareProductCard from './CompareProductCard'
import { Plus, Search, Scale, X } from 'lucide-react'
import { Popover, Input, Empty } from 'antd'
import { useNotification } from '../../context/useNotification'
import CompareProductResult from '../CompareProductResult'

const MAX_COMPARE = 4
const MIN_COMPARE = 2

interface CompareListInputProps {
  onCloseInput: () => void
  firstProduct: ProductResponse
}

export default function CompareListInput({ onCloseInput, firstProduct }: CompareListInputProps) {
  const { showNotification } = useNotification()

  const [listCompare, setListCompare] = useState<ProductResponse[]>([firstProduct])
  const [searchText, setSearchText] = useState('')
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const [compareIds, setCompareIds] = useState<number[] | null>(null)
  const [allProducts, setAllProducts] = useState<ProductResponse[]>([])

  // Đảm bảo sản phẩm đang xem luôn có mặt trong danh sách so sánh, không nhân đôi
  useEffect(() => {
    setListCompare((prev) => {
      if (prev.some((p) => p.productId === firstProduct.productId)) return prev
      return [firstProduct, ...prev]
    })
  }, [firstProduct])

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/products`)
        if (response.ok) {
          const data = await response.json()
          setAllProducts(data)
        } else {
          console.error('Failed to fetch products')
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }

    fetchAllProducts()
  }, [])

  const removeProduct = (productId: number) => {
    setListCompare((prev) => prev.filter((product) => product.productId !== productId))
  }

  const availableProducts = useMemo(() => {
    const chosenIds = new Set(listCompare.map((p) => p.productId))
    const keyword = searchText.trim().toLowerCase()
    return allProducts
      .filter((p) => !chosenIds.has(p.productId))
      .filter((p) => p.productName.toLowerCase().includes(keyword))
      .slice(0, 20)
  }, [allProducts, listCompare, searchText])

  const addProductToCompare = (product: ProductResponse) => {
    if (listCompare.length >= MAX_COMPARE) {
      showNotification({
        message: `Chỉ có thể so sánh tối đa ${MAX_COMPARE} sản phẩm`,
        type: 'WARNING',
        duration: 3000,
      })
      return
    }
    setListCompare((prev) => [...prev, product])
    setSearchText('')
    setIsPickerOpen(false)
  }

  const handleCompare = () => {
    if (listCompare.length < MIN_COMPARE) {
      showNotification({
        message: `Vui lòng chọn ít nhất ${MIN_COMPARE} sản phẩm để so sánh`,
        type: 'WARNING',
        duration: 3000,
      })
      return
    }
    setCompareIds(listCompare.map((p) => p.productId))
  }

  const pickerContent = (
    <div className="w-64 sm:w-72">
      <Input
        autoFocus
        allowClear
        prefix={<Search className="w-4 h-4 text-gray-400" />}
        placeholder="Tìm sản phẩm..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="mb-2"
      />
      <div className="max-h-64 overflow-y-auto flex flex-col gap-1">
        {availableProducts.length === 0 ? (
          <Empty
            description="Không tìm thấy sản phẩm"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            className="py-4"
          />
        ) : (
          availableProducts.map((product) => (
            <button
              key={product.productId}
              onClick={() => addProductToCompare(product)}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-emerald-50 text-left transition-colors"
            >
              <img
                src={product.imageUrls?.[0] ?? ''}
                alt={product.productName}
                className="w-10 h-10 rounded-lg object-cover bg-emerald-100 shrink-0"
              />
              <div className="min-w-0">
                <p className="text-sm font-medium text-green-900 truncate">{product.productName}</p>
                <p className="text-xs text-red-500 font-semibold">
                  {product.productPrice?.toLocaleString()} VNĐ
                </p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )

  return (
    <>
      <div className="compare-list-input max-w-5xl mx-auto fixed bottom-0 left-0 right-0 z-100 px-3 pb-3 sm:px-4 sm:pb-4">
        <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-xl shadow-emerald-900/10 border border-emerald-100">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                <Scale className="w-4 h-4 text-emerald-700" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base font-bold text-green-900 leading-tight">
                  So sánh sản phẩm
                </h3>
                <p className="text-xs text-gray-500">
                  Đã chọn {listCompare.length}/{MAX_COMPARE} sản phẩm
                </p>
              </div>
            </div>
            <button
              onClick={onCloseInput}
              className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors shrink-0"
              aria-label="Đóng so sánh"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="product-lists flex gap-3 overflow-x-auto pb-1 flex-1 min-w-0">
              {listCompare.map((product) => (
                <CompareProductCard
                  key={product.productId}
                  product={product}
                  removeProduct={removeProduct}
                />
              ))}

              {listCompare.length < MAX_COMPARE && (
                <Popover
                  content={pickerContent}
                  trigger="click"
                  open={isPickerOpen}
                  onOpenChange={setIsPickerOpen}
                  placement="topLeft"
                >
                  <div
                    className="compare-product-card bg-emerald-50/40 rounded-2xl p-3 border-2 border-dashed border-emerald-200 w-24 sm:w-28 shrink-0
                      hover:cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition-all duration-300 flex flex-col items-center justify-center gap-1 text-emerald-600 min-h-[88px]"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="text-xs font-medium text-center leading-tight">
                      Thêm sản phẩm
                    </span>
                  </div>
                </Popover>
              )}
            </div>

            <div className="flex gap-2 shrink-0 sm:flex-col sm:w-36">
              <button
                className="flex-1 sm:flex-none border border-red-200 text-red-500 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-50 transition-colors"
                onClick={onCloseInput}
              >
                Hủy
              </button>
              <button
                disabled={listCompare.length < MIN_COMPARE}
                className="flex-1 sm:flex-none bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-emerald-500"
                onClick={handleCompare}
              >
                So sánh
              </button>
            </div>
          </div>
        </div>
      </div>

      {compareIds && (
        <CompareProductResult
          open={!!compareIds}
          productIds={compareIds}
          onClose={() => setCompareIds(null)}
        />
      )}
    </>
  )
}
