import { Leaf, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { CartItemResponse, Cart } from '../model/cart.model'
import CartItem from '../components/CartItem'
import type { paymentMethodResponse } from '../model/paymentMethod.model'
import Checkout from '../components/Checkout'

export default function Cart() {
  // const [currentUser, setCurrentUser] = useState(null)
  const token = localStorage.getItem('token')

  const [cartItems, setCartItems] = useState<CartItemResponse[]>([])

  const [paymentMethods, setPaymentMethods] = useState<paymentMethodResponse[]>([])

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<number>()

  const [onClose, setOnClose] = useState(true)

  useEffect(() => {
    // Lay danh sach san pham trong gio hang
    const fetchCartItem = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/cart-items', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (response.status === 200) {
          const data = await response.json()
          setCartItems(data)
        }
      } catch (error) {
        console.error('Error fetching cart items:', error)
      }
    }

    // FETCH PHUONG THUC THANH TOAN
    const fetchPaymentMethods = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/payment-methods', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (response.status === 200) {
          const data = await response.json()
          setPaymentMethods(data)
        }
      } catch (error) {
        console.error('Error fetching payment methods:', error)
      }
    }
    if (token) {
      // fetchCart()
      fetchCartItem()
      fetchPaymentMethods()
    }
  }, [token])

  // CHAN CUON
  useEffect(() => {
    if (onClose == false) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [onClose])

  const handleCheckout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!selectedPaymentMethod) {
      alert('Vui lòng chọn phương thức thanh toán trước khi đặt hàng.')
      return
    }
    setOnClose(false)
  }

  const handleQuantityChange = (productId: number, newQty: number) => {
    setCartItems((currentItems) =>
      currentItems.map((item) => {
        if (item.productId !== productId) {
          return item
        }

        const unitPrice = item.quantity > 0 ? item.subtotal / item.quantity : 0
        return {
          ...item,
          quantity: newQty,
          subtotal: unitPrice * newQty,
        }
      })
    )
  }

  const handleRemoveItem = (productId: number) => {
    setCartItems((currentItems) => currentItems.filter((item) => item.productId !== productId))
  }

  //  tinh tong tien cua gio hang
  const totalPrice = cartItems.reduce((total, item) => total + item.subtotal, 0)
  return (
    <div className="page-cus_cart mt-14 min-h-screen bg-[#F8FFF4] text-left">
      <div className="max-w-7xl mx-auto">
        {/* Cart Header */}
        <header className="cart-header">
          {/* Breadcrumb */}
          <div className="max-w-7xl mx-auto px-3 py-4">
            <nav className="text-sm text-green-700">
              <Link to="/" className="hover:text-green-900">
                Trang chủ
              </Link>
              <span className="mx-2">/</span>
              <span className="text-green-900 font-medium">Giỏ hàng </span>
            </nav>
          </div>

          {/* Cart Title */}
          <div className="max-w-7xl mx-auto px-3 py-4">
            <h1 className="text-3xl font-bold text-green-900">
              Giỏ hàng{' '}
              <span className="text-lg text-emerald-400 font-medium">
                ({cartItems.length} sản phẩm)
              </span>
            </h1>
          </div>
        </header>
        {/* Cart Content */}
        <main className="cart-main grid grid-cols-3 gap-6">
          <main className="cart-content grid col-span-2 rounded-2xl">
            {/* Summary eco points and carbon_index reduce */}
            <div className="cart_summary--note bg-emerald-50 rounded-2xl border border-emerald-200 p-4 mb-6">
              <p className="text-emerald-700">
                <Leaf className="inline-block mr-2" size={22} />
                Bạn sẽ nhận được <span className="font-bold"> 150 </span> điểm sinh thái và giảm{' '}
                <span className="font-bold">0.5kg</span> khí thải carbon khi hoàn thành đơn hàng
                này.
              </p>
            </div>

            {/* Cart list items */}
            <div className="cart_list">
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <CartItem
                    key={item.productId}
                    item={item}
                    onQuantityChange={handleQuantityChange}
                    onRemove={handleRemoveItem}
                  />
                ))
              ) : (
                <p className="text-gray-500">Giỏ hàng của bạn đang trống.</p>
              )}
            </div>
          </main>

          <aside className="cart-aside grid col-s rounded-2xl">
            <div className=" bg-white rounded-2xl border border-emerald-200 p-4">
              <h2 className="text-xl font-bold text-green-900 mb-4">Tóm tắt đơn hàng</h2>

              {/* TINH TIEN HANG */}
              <div className="cart-aside--summary">
                <p className="text-md text-gray-700 mb2">
                  Tổng tiền tạm tính:{' '}
                  <span className="text-xl font-bold mx-2 text-red-500">
                    {Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                      totalPrice
                    )}
                  </span>
                </p>
              </div>

              {/* LUA CHON PHUONG THUC THANH*/}
              <div className="cart-aside--payment mt-4 p-4 rounded-2xl bg-emerald-50/80">
                <h3 className="text-md font-semibold text-green-900 mb-4">
                  Phương thức thanh toán
                </h3>
                <select
                  name=""
                  id=""
                  className="w-full border border-gray-200 rounded-2xl p-3 text-gray-400"
                  onChange={(e) => setSelectedPaymentMethod(Number(e.target.value))}
                >
                  <option value="" className="text-gray-400">
                    Chọn phương thức thanh toán
                  </option>
                  {paymentMethods.length === 0 ? (
                    <option value="" className="text-gray-400">
                      Không có phương thức thanh toán nào
                    </option>
                  ) : (
                    paymentMethods.map((method) => (
                      <option
                        key={method.paymentMethodId}
                        value={method.paymentMethodId}
                        className=""
                      >
                        {method.paymentMethodName} ({method.paymentMethodId})
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* TIEN VAN CHUYEN */}
              <div className="cart-aside--summary my-3">
                <p className="text-md text-gray-700 mb2">
                  Tổng tiền vận chuyển:{' '}
                  <span className="text-md font-bold mx-2 text-red-500">free</span>
                </p>
              </div>

              {/* TONG ECO POINT */}
              <div className="cart-aside--summary my-3">
                <p className="text-md text-gray-700 mb-2 flex items-center gap-2">
                  Eco points <Plus className="inline-block mr-2 h-6 w-6" size={22} /> :{' '}
                  <span className="text-md font-bold mx-2 text-emerald-500 flex items-center gap-1">
                    <Leaf className="inline-block mr-2" size={20} />
                    {totalPrice / 1000} Eco points
                  </span>
                </p>
              </div>

              {/* TONG TIEN TOAN BO */}
              <div className="cart-aside--summary mt-6 border-t border-gray-200 pt-3">
                <p className="text-lg text-gray-700 mb-2 font-semibold">
                  Tổng tiền thanh toán:{' '}
                  <span className="text-xl font-bold m-2 text-red-500">
                    {Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                      totalPrice
                    )}
                  </span>
                </p>
              </div>

              {/* DAT HANG */}
              <div className="cart-aside--checkout mt-12">
                <button
                  onClick={(e) => handleCheckout(e)}
                  className="w-full bg-primary text-white font-bold py-3 px-4 rounded-xl hover:bg-emerald-600 transition-colors hover:cursor-pointer hover:scale-102"
                >
                  Đặt hàng
                </button>
              </div>
            </div>
          </aside>
        </main>
        {!onClose && (
          <Checkout
            cartItems={cartItems}
            totalPrice={totalPrice}
            paymentMethodId={selectedPaymentMethod || 0}
            setOnClose={setOnClose}
          />
        )}
      </div>
      {!onClose && (
        <div className="overlay absolute top-0 left-0 w-full h-full bg-gray-700/50 z-51"></div>
      )}
    </div>
  )
}
