/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState, useRef, useCallback } from 'react'
import type { CartItemResponse } from '../model/cart.model'
import type { ProductIntroduce } from '../model/product.model'
import { Leaf, Minus, Plus, Trash2 } from 'lucide-react'

interface CartItemProps {
  item: CartItemResponse // Day la cart item
  onQuantityChange?: (productId: number, newQty: number) => void
  onRemove?: (productId: number) => void
}

export default function CartItem({ item, onQuantityChange, onRemove }: CartItemProps) {
  const [product, setProduct] = useState<ProductIntroduce | null>(null)
  // Optimistic quantity state — cập nhật UI ngay, sync API sau
  const [localQty, setLocalQty] = useState(item.quantity)
  const [localSubtotal, setLocalSubtotal] = useState(item.subtotal)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)

  // Ref để debounce: lưu timeout và quantity mới nhất cần sync
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingQty = useRef<number>(localQty)
  const unitPrice = useRef<number>(item.quantity > 0 ? item.subtotal / item.quantity : 0)

  // Sync localQty nếu prop thay đổi từ bên ngoài (ví dụ: parent re-fetch)
  useEffect(() => {
    setLocalQty(item.quantity)
    setLocalSubtotal(item.subtotal)
    unitPrice.current = item.quantity > 0 ? item.subtotal / item.quantity : 0
    pendingQty.current = item.quantity
  }, [item.quantity, item.subtotal])

  // Hàm gọi API thực sự — chỉ chạy sau debounce 500ms
  const syncQtyToServer = useCallback(
    async (newQty: number) => {
      setIsUpdating(true)
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(
          `http://localhost:8080/api/cart-items/${item.productId}?quantity=${newQty}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!response.ok) throw new Error('Update failed')

        // Báo lên parent để cập nhật tổng giỏ hàng và subtotal ngay trên trang Cart
        onQuantityChange?.(item.productId, newQty)
      } catch (error) {
        console.error('Error updating quantity:', error)
        // Rollback về quantity cũ nếu API lỗi
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

    // Cập nhật UI ngay lập tức (optimistic)
    pendingQty.current = newQty
    setLocalQty(newQty)
    setLocalSubtotal(unitPrice.current * newQty)

    // Cập nhật parent ngay để tổng tiền thay đổi liền trên trang giỏ hàng
    onQuantityChange?.(item.productId, newQty)

    // Debounce: huỷ timer cũ, đặt timer mới 500ms
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => {
      syncQtyToServer(pendingQty.current)
    }, 500)
  }

  const removeItem = async () => {
    // XOA GIO HANG
    setIsRemoving(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:8080/api/cart-items/${item.productId}`, {
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

  // Cleanup debounce timer khi component unmount
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/products/${item.productId}`)
        if (response.ok) {
          const data: ProductIntroduce = await response.json()

          const images = await fetch(`http://localhost:8080/api/products/${item.productId}/images`)
          if (images.ok) {
            const imageDatas = await images.json()
            data.productImage = imageDatas[0].imageUrl
          }
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
      className={`cartItem bg-white p-3 rounded-2xl border border-emerald-100 mb-4 flex items-center justify-between hover:cursor-pointer hover:shadow-md transition-all duration-300 ${
        isRemoving ? 'opacity-50 pointer-events-none' : ''
      }`}
    >
      {product && (
        <div className="cartItem_content flex items-center gap-4 w-full">
          <div className="cartItem_image">
            <img
              src={product.productImage}
              alt={product.productName}
              className="cartItem-img w-24 h-24 rounded-2xl object-cover"
            />
          </div>

          <div className="cartItem_main flex-1 relative">
            <div className="cartItem_info">
              <h2 className="text-md font-semibold text-green-900">{product.productName}</h2>
              <p className="text-xs text-emerald-400">{product.categoryName}</p>
              <div className="px-3 text-sm font-bold rounded-full bg-emerald-50 text-emerald-600 w-fit mt-2">
                <Leaf className="inline-block w-4 h-4 mr-1" />
                Eco <span>{product.baseEcoPoints * localQty}</span>
              </div>

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
                  className={`px-3 py-1.5 text-green-900 font-semibold text-sm min-w-8 text-center transition-opacity duration-150 ${
                    isUpdating ? 'opacity-60' : 'opacity-100'
                  }`}
                >
                  {localQty}
                </span>

                <button
                  onClick={() => updateQty(1)}
                  disabled={isUpdating}
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
