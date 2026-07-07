/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import type { CartItemResponse } from '../model/cart.model'
import { X } from 'lucide-react'
import type { voucherResponse } from '../model/voucher.model'
import { PaymentMethodName } from '../enum/PaymentMethod.enum'
import { useNavigate } from 'react-router-dom'
import { useNotification } from '../context/useNotification'
import type { Addressresponse } from '../model/address.model'
import { useCustomer } from '../context/useCustomer'

interface CheckoutProps {
  cartItems: CartItemResponse[]
  totalPrice: number
  paymentMethodId: number
  setOnClose: (value: boolean) => void
}

export default function Checkout({
  cartItems,
  totalPrice,
  paymentMethodId,
  setOnClose,
}: CheckoutProps) {
  const navigate = useNavigate()
  const [orderReceiver, setOrderReceiver] = useState('')
  const [orderReceiverPhone, setOrderReceiverPhone] = useState('')

  const [addresses, setAddresses] = useState<Addressresponse[]>([])
  const [selectedAddress, setSelectedAddress] = useState<Addressresponse | undefined>()

  const [showAddressList, setShowAddressList] = useState(false)

  const [vouchers, setVouchers] = useState<
    { voucherId: number; code: string; discountValue: number }[]
  >([])

  const [selectedVoucher, setSelectedVoucher] = useState<{
    voucherId: number
    code: string
    discountValue: number
  } | null>(null)

  const paymentMethodName = PaymentMethodName[paymentMethodId as keyof typeof PaymentMethodName]

  const token = localStorage.getItem('token')

  const [valueSale, setValueSale] = useState<number>(0)

  // SHOW NOTIFICATION
  const { showNotification } = useNotification()

  useEffect(() => {
    const totalDiscount = () => {
      if (selectedVoucher) {
        const value = (selectedVoucher.discountValue / 100) * totalPrice
        setValueSale(value)
      } else {
        setValueSale(0)
      }
    }

    totalDiscount()
  }, [selectedVoucher, totalPrice])

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/vouchers', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setVouchers(
            data.map((voucher: voucherResponse) => ({
              voucherId: voucher.voucherId,
              code: voucher.code,
              discountValue: voucher.discountValue,
            }))
          )
        }
      } catch (error) {
        console.error('Error fetching vouchers:', error)
      }
    }

    // FETCH ADDRESS hien tai
    const fetchAddresses = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/addresses', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setAddresses(data)
        }
      } catch (error) {
        console.error('Error fetching addresses:', error)
      }
    }

    if (token) {
      fetchVouchers()
      fetchAddresses()
    }
  }, [token])

  // XU LY DAT HANG
  const handleSubmitCheckout = async () => {
    const data = {
      orderReceiver: orderReceiver,
      orderReceiverPhone: orderReceiverPhone,
      paymentMethodId: paymentMethodId,
      addressId: selectedAddress?.addressId,
      voucherId: selectedVoucher?.voucherId || null,
      productIds: cartItems.map((item) => item.productId),
    }

    console.log('Checkout data:', data)

    const response = await fetch('http://localhost:8080/api/orders/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(data),
    })

    if (response.ok) {
      if (paymentMethodId === 2) {
        showNotification({
          message: 'Đặt hàng thành công!',
          type: 'SUCCESS',
          duration: 3000,
        })
        navigate('/')
      } else {
        showNotification({
          message: 'Đặt hàng thành công! Vui lòng thanh toán trực tuyến.',
          type: 'SUCCESS',
          duration: 3000,
        })
        const data = await response.json()
        navigate(`/cart/${data.orderId}/payment-online`)
      }
    } else {
      showNotification({
        message: 'Đặt hàng thất bại. Vui lòng thử lại.',
        type: 'ERROR',
        duration: 3000,
      })
      navigate('/cart')
    }
  }

  return (
    <div className="dialog_checkout fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-55">
      <div className=" shadow-md bg-white p-4 rounded-2xl relative max-h-2xl lg:w-4xl overflow-y-scroll">
        <X
          className="absolute top-2 right-2 hover:cursor-pointer"
          size={20}
          onClick={() => setOnClose(true)}
        />
        <header className="checkout-header p-3 border-b border-gray-200">
          <h2 className="text-2xl text-center font-bold text-green-900 my-2">
            Xác nhận đơn đặt hàng
          </h2>
        </header>

        <div className="grid grid-cols-3 gap-4">
          {/* THONG TIN NGUOI NHAN */}
          <aside className="py-4">
            <h2 className="text-xl font-semibold text-green-900 mb-4">Thông tin người nhận</h2>
            <div className="">
              <div className="mb-4 flex-1">
                <label htmlFor="orderReceiver" className="block text-green-900 font-semibold mb-2">
                  Tên người nhận:
                </label>
                <input
                  type="text"
                  id="orderReceiver"
                  value={orderReceiver}
                  onChange={(e) => setOrderReceiver(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-2"
                  placeholder="Nhập tên người nhận"
                />
              </div>
              <div className="mb-4 flex-1">
                <label
                  htmlFor="orderReceiverPhone"
                  className="block text-green-900 font-semibold mb-2"
                >
                  Số điện thoại người nhận:
                </label>
                <input
                  type="text"
                  id="orderReceiverPhone"
                  value={orderReceiverPhone}
                  onChange={(e) => setOrderReceiverPhone(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-2"
                  placeholder="Nhập số điện thoại người nhận"
                />
              </div>
            </div>

            {/* CHON DIA CHI GIAO HANG */}
            <div className="text-md text-green-900 font-semibold my-2">Chọn địa chỉ giao hàng</div>
            <div className="flex flex-col gap-2">
              {/* DIA CHI MAC DINH */}
              {selectedAddress === undefined}
              {addresses.map((address) =>
                address.isDefault ? (
                  <div
                    className={`address p-3 border border-gray-400 rounded-2xl hover:cursor-pointer ${selectedAddress?.addressId == address.addressId ? 'bg-emerald-50/80' : ''} ${selectedAddress?.addressId === address.addressId ? 'bg-emerald-50/80' : ''}`}
                    onClick={() => setSelectedAddress(address)}
                    key={address.addressId}
                  >
                    <h2 className="text-md font-semibold text-green-900">{address.addressName}</h2>
                    <p className="text-sm text-gray-700">
                      {address.addressStreet}, {address.villageName}, {address.cityName}
                    </p>
                  </div>
                ) : null
              )}
              <div
                onClick={() => setShowAddressList(true)}
                className="text-gray-500 relative text-sm text-center hover:cursor-pointer hover:text-gray-800 hover:underline"
              >
                ---- Tùy chọn địa chỉ ----
                {showAddressList && (
                  <div className="absolute bottom-0 left-50 min-w-2xs p-3 bg-white shadow rounded-2xl z-56">
                    <p className="p-2 text-left">Danh sách địa chỉ</p>
                    {addresses.map((address) => (
                      <div
                        className={`address p-2 mb-2 border border-gray-400 rounded-2xl hover:cursor-pointer hover:bg-amber-50 ${selectedAddress == address.addressId ? 'bg-emerald-50/80' : ''}`}
                        onClick={() => {
                          setSelectedAddress(address.addressId)
                          setShowAddressList(false)
                        }}
                        key={address.addressId}
                      >
                        <h2 className="text-sm text-left font-semibold text-green-900">
                          {address.addressName}
                        </h2>
                        <p className="text-xs text-gray-700">
                          {address.addressStreet}, {address.villageName}, {address.cityName}
                        </p>
                      </div>
                    ))}

                    <div
                      className="text-gray-500 relative text-sm text-center hover:cursor-pointer
                     hover:text-gray-800 hover:underline"
                    >
                      Thêm địa chỉ mới
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>
          {/* THONG TIN DON HANG */}
          <main className="checkout-main col-span-2 p-4">
            <h2 className="text-xl font-semibold text-green-900 mb-2">Thông tin đơn hàng</h2>
            {/* Checkout Table */}
            <section className="checkout-table">
              <table className="w-full border border-gray-200 rounded-2xl">
                <thead className="bg-emerald-50/80">
                  <tr>
                    <th className="text-left p-3 border-b border-gray-200">Tên sản phẩm</th>
                    <th className="text-left p-3 border-b border-gray-200">Số lượng</th>
                    <th className="text-left p-3 border-b border-gray-200">Đơn giá</th>
                    <th className="text-left p-3 border-b border-gray-200">Tổng</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.productId}>
                      <td className="p-3 border-b border-gray-200">{item.productName}</td>
                      <td className="p-3 border-b border-gray-200">{item.quantity}</td>
                      <td className="p-3 border-b border-gray-200">
                        {Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                          item.subtotal / item.quantity
                        )}
                      </td>
                      <td className="p-3 border-b border-gray-200">
                        {Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                          item.subtotal
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            {/* APPLY VOUCHER */}
            <section>
              <div className="list-voucher p-3 flex items-center gap-4 mt-2 rounded-2xl ">
                <label
                  htmlFor="voucher"
                  className="text-md font-semibold text-green-900 mb-2 block"
                >
                  Mã giảm giá
                </label>
                <select
                  name=""
                  id="voucher"
                  onChange={(e) => {
                    const selected = vouchers.find((v) => v.voucherId === parseInt(e.target.value))
                    setSelectedVoucher(selected || null)
                  }}
                  className="flex-1 border border-gray-200 rounded-2xl p-3 text-gray-400"
                >
                  <option value="">Chọn mã giảm giá</option>
                  {vouchers.map((voucher) => (
                    <option key={voucher.voucherId} value={voucher.voucherId}>
                      {voucher.code}
                    </option>
                  ))}
                </select>

                <span className="flex-1 text-right text-red-500 font-bold text-md">
                  {Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                    -valueSale
                  )}
                </span>
              </div>
            </section>

            {/* Phuong thuc thanh toan */}
            <section className="px-3 py-2">
              <div className="flex items-center gap-4">
                <h2 className="text-green-900 text-md font-semibold">Phương thức thanh toán: </h2>
                <span className="text-red-500 font-bold text-md">{paymentMethodName}</span>
              </div>
            </section>

            {/* TONG TIEN DON HANG + khuyen mai*/}
            <section className="px-3 py-2">
              <div className="flex items-center gap-4 mt-2">
                <h2 className="text-green-900 text-md font-semibold uppercase">
                  Tổng tiền đơn hàng:{' '}
                </h2>
                <span className="text-red-500 font-bold text-xl">
                  {Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                    totalPrice - valueSale
                  )}
                </span>
              </div>
            </section>

            {/* XAC NHAN THANH TOAN */}
            <div className="px-3 py-2">
              <button
                onClick={() => handleSubmitCheckout()}
                className="bg-primary hover:cursor-pointer hover:scale-101 transform text-white font-bold py-3 px-4 rounded-2xl duration-300 transition-all w-full active:scale-99"
              >
                Xác nhận thanh toán
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
