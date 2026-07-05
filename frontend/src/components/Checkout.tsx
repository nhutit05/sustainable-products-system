/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import type { CartItemResponse } from '../model/cart.model'
import { X } from 'lucide-react'
import type { voucherResponse } from '../model/voucher.model'
import { PaymentMethodName } from '../enum/PaymentMethod.enum'
import { useNavigate } from 'react-router-dom'
import { useNotification } from '../context/useNotification'

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

    if (token) {
      fetchVouchers()
    }
  }, [token])

  // XU LY DAT HANG
  const handleSubmitCheckout = async () => {
    const data = {
      orderReceiver: orderReceiver,
      orderReceiverPhone: orderReceiverPhone,
      paymentMethodId: paymentMethodId,
      voucherId: selectedVoucher?.voucherId || 0,
      productIds: cartItems.map((item) => item.productId),
    }

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
        navigate('/home')
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
      <div className=" shadow-md bg-white overflow-hidden p-4 rounded-2xl relative">
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

        {/* THONG TIN NGUOI NHAN */}
        <aside className="p-4">
          <h2 className="text-xl font-semibold text-green-900 mb-4">Thông tin người nhận</h2>
          <div className="flex items-center gap-4">
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
              />
            </div>
          </div>
        </aside>
        <main className="checkout-main">
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
              <label htmlFor="voucher" className="text-md font-semibold text-green-900 mb-2 block">
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
  )
}
