import { useEffect, useState } from 'react'
import type { CartItemResponse } from '../model/cart.model'
import { X } from 'lucide-react'
import type { voucherResponse } from '../model/voucher.model'
import { PaymentMethodName } from '../enum/PaymentMethod.enum'
import { useNavigate } from 'react-router-dom'
import { useNotification } from '../context/useNotification'
import type { Addressresponse } from '../model/address.model'
import AddNewAddress from './AddNewAddress'
import PayOSEmbedded from './PayOSEmbedded'

interface OrderSummary {
  items: CartItemResponse[]
  total: number
  discount: number
  paymentMethod: string
  receiver: string
  phone: string
  address: string
}

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
  const token = localStorage.getItem('token')
  const { showNotification } = useNotification()

  const [orderReceiver, setOrderReceiver] = useState('')
  const [orderReceiverPhone, setOrderReceiverPhone] = useState('')

  const [addresses, setAddresses] = useState<Addressresponse[]>([])
  const [selectedAddress, setSelectedAddress] = useState<Addressresponse | null>(null)

  const [showAddressList, setShowAddressList] = useState(false)
  const [showAddAddress, setShowAddAddress] = useState(false)

  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<number>()
  const [expiredAt, setExpiredAt] = useState<string | null>(null)
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null)

  const [vouchers, setVouchers] = useState<
    { voucherId: number; code: string; discountValue: number }[]
  >([])

  const [selectedVoucher, setSelectedVoucher] = useState<{
    voucherId: number
    code: string
    discountValue: number
  } | null>(null)

  const [valueSale, setValueSale] = useState(0)

  const paymentMethodName = PaymentMethodName[paymentMethodId as keyof typeof PaymentMethodName]

  const refreshAddresses = async (preferSelectedId?: number) => {
    try {
      const response = await fetch('http://localhost:8080/api/addresses', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setAddresses(data)

        const nextSelected =
          data.find((address: Addressresponse) => address.addressId === preferSelectedId) ||
          data.find((address: Addressresponse) => address.isDefault) ||
          data[0] ||
          null

        setSelectedAddress(nextSelected)
      }
    } catch (error) {
      console.error('Fetch address error:', error)
    }
  }

  useEffect(() => {
    if (selectedVoucher) {
      setValueSale((selectedVoucher.discountValue / 100) * totalPrice)
    } else {
      setValueSale(0)
    }
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
        console.error('Fetch voucher error:', error)
      }
    }

    if (token) {
      fetchVouchers()
      refreshAddresses()
    }
  }, [token])

  const handleSubmitCheckout = async () => {
    const request = {
      orderReceiver,
      orderReceiverPhone,
      paymentMethodId,
      addressId: selectedAddress?.addressId,
      voucherId: selectedVoucher?.voucherId ?? null,
      productIds: cartItems.map((item) => item.productId),
    }

    try {
      const response = await fetch('http://localhost:8080/api/orders/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(request),
      })

      const result = await response.json()

      if (!response.ok) {
        showNotification({
          message: 'Đặt hàng thất bại. Vui lòng thử lại.',
          type: 'ERROR',
          duration: 3000,
        })
        return
      }

      // COD

      if (!result.checkoutUrl) {
        showNotification({
          message: 'Đặt hàng thành công!',
          type: 'SUCCESS',
          duration: 3000,
        })

        navigate('/')

        return
      }

      // PAYOS

      setOrderId(result.order.orderId)

      setCheckoutUrl(result.checkoutUrl)

      setExpiredAt(result.expiredAt)
      setQrCode(result.qrCode)

      setOrderSummary({
        items: cartItems,
        total: totalPrice - valueSale,
        discount: valueSale,
        paymentMethod: paymentMethodName,
        receiver: orderReceiver,
        phone: orderReceiverPhone,
        address: selectedAddress
          ? `${selectedAddress.addressStreet}, ${selectedAddress.villageName}, ${selectedAddress.cityName}`
          : 'Chưa có địa chỉ',
      })
    } catch (error) {
      console.error(error)

      showNotification({
        message: 'Có lỗi xảy ra khi đặt hàng.',
        type: 'ERROR',
        duration: 3000,
      })
    }
  }

  if (checkoutUrl && orderSummary && qrCode) {
    return (
      <PayOSEmbedded
        checkoutUrl={checkoutUrl}
        orderId={orderId!}
        qrCode={qrCode}
        expiredAt={expiredAt}
        setOnClose={setOnClose}
        orderSummary={orderSummary}
      />
    )
  }

  return (
    <div className="fixed inset-0 z-52 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-3xl shadow-xl w-[90vw] max-w-6xl max-h-[90vh] overflow-y-auto p-6 relative">
        <X
          size={24}
          className="absolute right-5 top-5 cursor-pointer hover:text-red-500"
          onClick={() => setOnClose(true)}
        />

        <h1 className="text-3xl font-bold text-center text-green-900 mb-6">
          Xác nhận đơn đặt hàng
        </h1>

        <div className="grid grid-cols-3 gap-6">
          <aside className="space-y-5">
            <h2 className="text-xl font-bold text-green-900">Thông tin người nhận</h2>

            <div>
              <label className="block font-semibold text-green-900 mb-2">Tên người nhận</label>

              <input
                value={orderReceiver}
                onChange={(e) => setOrderReceiver(e.target.value)}
                placeholder="Nhập tên người nhận"
                className="w-full border border-slate-200 rounded-xl p-3"
              />
            </div>

            <div>
              <label className="block font-semibold text-green-900 mb-2">Số điện thoại</label>

              <input
                value={orderReceiverPhone}
                onChange={(e) => setOrderReceiverPhone(e.target.value)}
                placeholder="Nhập số điện thoại"
                className="w-full border border-slate-200 rounded-xl p-3"
              />
            </div>

            <h2 className="text-xl font-bold text-green-900">Địa chỉ giao hàng</h2>

            {addresses
              .filter((address) => address.isDefault)
              .map((address) => (
                <button
                  key={address.addressId}
                  type="button"
                  onClick={() => setSelectedAddress(address)}
                  className={`w-full text-left border border-slate-200 rounded-2xl p-4 ${
                    selectedAddress?.addressId === address.addressId
                      ? 'bg-emerald-50 border-emerald-500'
                      : ''
                  }`}
                >
                  <p className="font-bold text-green-900">{address.addressName}</p>

                  <p className="text-sm text-gray-600">
                    {address.addressStreet}, {address.villageName}, {address.cityName}
                  </p>
                </button>
              ))}

            <button
              type="button"
              className="text-sm font-bold text-gray-500 hover:underline"
              onClick={() => setShowAddressList(!showAddressList)}
            >
              -- Chọn địa chỉ khác --
            </button>




            {
              showAddressList && (

                <div className="border border-slate-200 rounded-xl p-3 space-y-2">

                  {
                    addresses.map(address => (

                      <button
                        key={address.addressId}
                        type="button"
                        className="block w-full text-left p-3 rounded-xl hover:bg-emerald-50"
                        onClick={() => {
                          setSelectedAddress(address)
                          setShowAddressList(false)
                        }}
                      >

                        <p className="font-semibold">
                          {address.addressName}
                        </p>

                    <p className="text-sm">
                      {address.addressStreet}, {address.villageName}, {address.cityName}
                    </p>
                  </button>
                ))}

                <button
                  className="text-sm text-gray-500 hover:underline"
                  onClick={() => {
                    setShowAddressList(false)
                    setShowAddAddress(true)
                  }}
                >
                  + Thêm địa chỉ mới
                </button>
              </div>
            )}

            {showAddAddress && (
              <AddNewAddress
                setShowAddAddress={setShowAddAddress}
                redirectToProfile={false}
                onSuccess={() => refreshAddresses()}
              />
            )}
          </aside>

          <main className="col-span-2 space-y-5">
            <h2 className="text-xl font-bold text-green-900">Thông tin đơn hàng</h2>

            <div className="border border-slate-200 rounded-2xl overflow-hidden">


              <table className="w-full">
                <thead className="bg-emerald-50">
                  <tr>
                    <th className="p-3 text-left">Sản phẩm</th>

                    <th className="p-3 text-left">Số lượng</th>

                    <th className="p-3 text-left">Đơn giá</th>

                    <th className="p-3 text-left">Thành tiền</th>
                  </tr>
                </thead>

                <tbody>


                  {
                    cartItems.map(item => (

                      <tr key={item.productId} className="border-t border border-slate-200">

                      <td className="p-3">{item.productName}</td>
                      
                      <td className="p-3">{item.quantity}</td>

                      <td className="p-3">
                        {Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        }).format(item.subtotal / item.quantity)}
                      </td>

                      <td className="p-3 font-semibold">
                        {Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        }).format(item.subtotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl">
              <label className="font-semibold text-green-900">Mã giảm giá</label>

              <select

                className="flex-1 border border-slate-300 rounded-xl p-3"

                onChange={(e) => {
                  const selected = vouchers.find(
                    (voucher) => voucher.voucherId === Number(e.target.value)
                  )

                  setSelectedVoucher(selected ?? null)
                }}
              >
                <option value="">Chọn voucher</option>

                {vouchers.map((voucher) => (
                  <option key={voucher.voucherId} value={voucher.voucherId}>
                    {voucher.code} - {voucher.discountValue}%
                  </option>
                ))}
              </select>

              <span className="font-bold text-red-500">
                -
                {Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                }).format(valueSale)}
              </span>
            </div>

            <div className="flex justify-between items-center bg-emerald-50 p-4 rounded-2xl">
              <span className="font-semibold text-green-900">Phương thức thanh toán</span>

              <span className="font-bold text-green-700">{paymentMethodName}</span>
            </div>

            <div className="flex justify-between items-center border border-slate-200 rounded-2xl p-5">


              <span className="text-xl font-bold text-green-900">
                Tổng thanh toán
              </span>



              <span className="text-2xl font-bold text-red-500">
                {Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                }).format(totalPrice - valueSale)}
              </span>
            </div>

            <button
              onClick={handleSubmitCheckout}
              className="
                w-full
                bg-primary
                text-white
                font-bold
                py-4
                rounded-2xl
                transition
                hover:scale-[1.02]
                active:scale-95
              "
            >
              Xác nhận thanh toán
            </button>
          </main>
        </div>
      </div>
    </div>
  )
}
