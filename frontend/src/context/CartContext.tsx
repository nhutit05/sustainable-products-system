import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'

interface CartContextType {
  totalItems: number
  refreshCartCount: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [totalItems, setTotalItems] = useState<number>(0)

  // Hàm gọi API lấy số lượng giỏ hàng
  const refreshCartCount = useCallback(async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setTotalItems(0)
      return
    }
    try {
      const response = await fetch('http://localhost:8080/api/cart-items', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setTotalItems(data.length)
      }
    } catch (error) {
      console.error('Error fetching total items in cart:', error)
    }
  }, [])

  // Tự động tải lần đầu khi ứng dụng khởi chạy
  useEffect(() => {
    refreshCartCount()
  }, [refreshCartCount])

  return (
    <CartContext.Provider value={{ totalItems, refreshCartCount }}>{children}</CartContext.Provider>
  )
}

// Custom hook để dùng ở các component khác
export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
