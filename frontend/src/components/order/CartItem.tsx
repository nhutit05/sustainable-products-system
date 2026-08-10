import { useEffect, useState, useRef, useCallback } from 'react'
import type { CartItemResponse } from '../../model/cart.model'
import type { ProductDetail } from '../../model/product.model'
import { AlertTriangle, Leaf, Minus, Plus, Trash2 } from 'lucide-react'
import { useNotification } from '../../context/useNotification'

interface CartItemProps {
  item: CartItemResponse
  onQuantityChange?: (productId: number, newQty: number) => void
  onRemove?: (productId: number) => void
}

export default function CartItem({ item, onQuantityChange, onRemove }: CartItemProps) {
  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [localQty, setLocalQty] = useState(item.quantity)
  const [localSubtotal, setLocalSubtotal] = useState(item.subtotal)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)

  const { showNotification } = useNotification()

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingQty = useRef<number>(localQty)
  const unitPrice = useRef<number>(item.quantity > 0 ? item.subtotal / item.quantity : 0)
  const hasWarnedRef = useRef(false) // tránh spam notification mỗi lần render

  // Trạng thái tồn kho — chỉ tính được khi đã có product
  const isOutOfStock = !!product && product.inventory === 0
  const isInsufficientStock = !!product && !isOutOfStock && localQty > product.inventory
  const isUnavailable = isOutOfStock || isInsufficientStock

  useEffect(() => {
    if (!product) return

    if (item.quantity > product.inventory && !hasWarnedRef.current) {
      hasWarnedRef.current = true
      showNotification({
        message:
          product.inventory === 0
            ? `Sản phẩm "${product.productName}" hiện đã hết hàng.`
            : `Số lượng sản phẩm "${product.productName}" trong giỏ hàng vượt quá tồn kho hiện có (${product.inventory}). Vui lòng điều chỉnh lại.`,
        type: 'WARNING',
        duration: 3000,
      })
    }

    setLocalQty(item.quantity)
    setLocalSubtotal(item.subtotal)
    unitPrice.current = item.quantity > 0 ? item.subtotal / item.quantity : 0
    pendingQty.current = item.quantity
  }, [item.quantity, item.subtotal, product, showNotification])

  const syncQtyToServer = useCallback(
    async (newQty: number) => {
      setIsUpdating(true)
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(
          `/api/cart-items/${item.productId}?quantity=${newQty}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!response.ok) throw new Error('Update failed')

        onQuantityChange?.(item.productId, newQty)
      } catch (error) {
        console.error('Error updating quantity:', error)
        setLocalQty(item.quantity)
        setLocalSubtotal(item.subtotal)
        pendingQty.current = item.quantity
      } finally {
        setIsUpdating(false)
      }
    },
    [item.productId, item.quantity, item.subtotal, onQuantityChange]
  )

  const updateQty = (change: number) => {
    const newQty = pendingQty.current + change

    if (newQty < 1) return

    // Chỉ chặn TĂNG vượt tồn kho — nếu item đang > tồn kho sẵn (do tồn kho giảm sau khi thêm),
    // khách vẫn được giảm xuống để về mức hợp lệ
    if (product && change > 0 && newQty > product.inventory) {
      showNotification({
        message: `Chỉ còn ${product.inventory} sản phẩm "${product.productName}" trong kho.`,
        type: 'WARNING',
        duration: 3000,
      })
      return
    }

    pendingQty.current = newQty
    setLocalQty(newQty)
    setLocalSubtotal(unitPrice.current * newQty)

    onQuantityChange?.(item.productId, newQty)

    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => {
      syncQtyToServer(pendingQty.current)
    }, 500)
  }

  const removeItem = async () => {
    setIsRemoving(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/cart-items/${item.productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) throw new Error('Remove failed')
      onRemove?.(item.productId)
    } catch (error) {
      console.error('Error removing item:', error)
      setIsRemoving(false)
    }
  }

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${item.productId}`)
        if (response.ok) {
          const data: ProductDetail = await response.json()
          setProduct(data)
        } else {
          console.error('Failed to fetch product data')
        }
      } catch (error) {
        console.error('Error fetching product data:', error)
      }
    }

    fetchProduct()
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    }
  }, [item.productId])

  return (
    <div
      className={`cartItem bg-white p-3 rounded-2xl border mb-4 flex items-center justify-between transition-all duration-300 ${
        isUnavailable
          ? 'border-red-200 bg-red-50/40 opacity-60 grayscale-[30%]'
          : 'border-emerald-100 hover:cursor-pointer hover:shadow-md'
      } ${isRemoving ? 'opacity-50 pointer-events-none' : ''}`}
    >
      {product && (
        <div className="cartItem_content flex items-center gap-4 w-full">
          <div className="cartItem_image relative">
            <img
              src={product.imageUrls[0] || '/images/default-product.png'}
              alt={product.productName}
              className={`cartItem-img w-24 h-24 rounded-2xl object-cover ${
                isUnavailable ? 'grayscale' : ''
              }`}
            />
            {isOutOfStock && (
              <span className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 text-white text-xs font-bold">
                Hết hàng
              </span>
            )}
          </div>

          <div className="cartItem_main flex-1 relative">
            <div className="cartItem_info">
              <h2 className="text-md font-semibold text-green-900">{product.productName}</h2>
              <p className="text-xs text-emerald-400">{product.categoryName}</p>
              <div className="px-3 text-sm font-bold rounded-full bg-emerald-50 text-emerald-600 w-fit mt-2">
                <Leaf className="inline-block w-4 h-4 mr-1" />
                Eco <span>{product.baseEcoPoints * localQty}</span>
              </div>

              {/* Cảnh báo tồn kho không đủ, hiển thị cố định trên item */}
              {isUnavailable && (
                <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-red-600">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  {isOutOfStock
                    ? 'Sản phẩm hiện đã hết hàng'
                    : `Chỉ còn ${product.inventory} sản phẩm, vui lòng điều chỉnh số lượng`}
                </div>
              )}

              <div className="cartItem--remove absolute top-0 right-0">
                <button
                  onClick={removeItem}
                  disabled={isRemoving}
                  className="text-gray-300 hover:text-red-500 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="cartItem_price mt-3 flex items-center justify-between gap-4">
              <div className="flex items-center border border-green-200 rounded-xl overflow-hidden bg-green-50 max-w-fit">
                <button
                  onClick={() => updateQty(-1)}
                  disabled={localQty <= 1 || isUpdating}
                  className="px-3 py-1.5 text-green-700 hover:bg-green-100 transition-colors font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                <span
                  className={`px-3 py-1.5 font-semibold text-sm min-w-8 text-center transition-opacity duration-150 ${
                    isUnavailable ? 'text-red-600' : 'text-green-900'
                  } ${isUpdating ? 'opacity-60' : 'opacity-100'}`}
                >
                  {localQty}
                </span>

                <button
                  onClick={() => updateQty(1)}
                  disabled={isUpdating || isOutOfStock || localQty >= product.inventory}
                  className="px-3 py-1.5 text-green-700 hover:bg-green-100 transition-colors font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-green-900 text-xl font-bold">
                <span className="text-red-500 mr-3 transition-all duration-200">
                  {Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(localSubtotal)}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
