import { useEffect, useState } from 'react'
import type { CartItemResponse } from '../../model/cart.model'
import type { voucherResponse } from '../../model/voucher.model'
import { PaymentMethodName } from '../../enum/PaymentMethod.enum'
import { useNavigate } from 'react-router-dom'
import { useNotification } from '../../context/useNotification'
import type { Addressresponse } from '../../model/address.model'
import AddNewAddress from '../admin/AddNewAddress'
import PayOSEmbedded from './PayOSEmbedded'
import {
  Modal,
  Typography,
  Input,
  Button,
  Select,
  Tag,
  Divider,
  Radio,
} from 'antd'
import {
  UserOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  ShopOutlined,
  TagOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  GiftOutlined,
} from '@ant-design/icons'

const { Text, Title } = Typography

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

  const formatCurrency = (value: number) =>
    Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)

  return (
    <Modal
      open
      footer={null}
      width={1100}
      zIndex={99}
      centered
      onCancel={() => setOnClose(true)}
      className="checkout-modal"
      styles={{ body: { padding: 0, borderRadius: 16, overflow: 'hidden' } }}
    >
      {/* Header */}
      <div
        className="px-5 py-4 sm:px-6 sm:py-5"
        style={{ background: 'linear-gradient(135deg, #16a34a, #059669)' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <Title level={4} style={{ color: '#fff', margin: 0 }}>
              Xác nhận đơn hàng
            </Title>
            <Text style={{ color: '#d1fae5', fontSize: 13 }}>
              Kiểm tra thông tin trước khi đặt hàng
            </Text>
          </div>
          <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full">
            <ShopOutlined style={{ color: '#fff' }} />
            <Text style={{ color: '#fff', fontSize: 13, fontWeight: 500 }}>
              {cartItems.length} sản phẩm
            </Text>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-h-[75vh] overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5">
          {/* Left - Receiver Info */}
          <div className="lg:col-span-2 p-4 sm:p-5 lg:border-r border-gray-100 bg-gray-50/50">
            <div className="space-y-4">
              {/* Receiver */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <UserOutlined className="text-emerald-600 text-sm" />
                  </div>
                  <Text strong className="text-sm">
                    Thông tin người nhận
                  </Text>
                </div>
                <div className="space-y-3">
                  <div>
                    <Text className="text-xs text-gray-500 mb-1 block">Họ và tên</Text>
                    <Input
                      value={orderReceiver}
                      onChange={(e) => setOrderReceiver(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      prefix={<UserOutlined className="text-gray-400" />}
                      size="large"
                      style={{ borderRadius: 10 }}
                    />
                  </div>
                  <div>
                    <Text className="text-xs text-gray-500 mb-1 block">Số điện thoại</Text>
                    <Input
                      value={orderReceiverPhone}
                      onChange={(e) => setOrderReceiverPhone(e.target.value)}
                      placeholder="0912 345 678"
                      prefix={<PhoneOutlined className="text-gray-400" />}
                      size="large"
                      style={{ borderRadius: 10 }}
                    />
                  </div>
                </div>
              </div>

              <Divider style={{ margin: '12px 0' }} />

              {/* Address */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <EnvironmentOutlined className="text-emerald-600 text-sm" />
                    </div>
                    <Text strong className="text-sm">
                      Địa chỉ giao hàng
                    </Text>
                  </div>
                  <Button
                    type="link"
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={() => setShowAddAddress(true)}
                    className="!text-emerald-600 !text-xs"
                  >
                    Thêm mới
                  </Button>
                </div>

                {/* Default Address */}
                <div className="space-y-2">
                  {addresses
                    .filter((address) => address.isDefault)
                    .map((address) => (
                      <div
                        key={address.addressId}
                        onClick={() => setSelectedAddress(address)}
                        className={`p-3 rounded-xl cursor-pointer transition-all ${
                          selectedAddress?.addressId === address.addressId
                            ? 'bg-emerald-50 border-2 border-emerald-500'
                            : 'bg-white border border-gray-200 hover:border-emerald-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Text strong className="text-sm">
                                {address.addressName}
                              </Text>
                              <Tag color="green" style={{ fontSize: 11, padding: '0 6px', lineHeight: '18px' }}>
                                Mặc định
                              </Tag>
                            </div>
                            <Text className="text-xs text-gray-500 block truncate">
                              {address.addressStreet}, {address.villageName}, {address.cityName}
                            </Text>
                          </div>
                          {selectedAddress?.addressId === address.addressId && (
                            <CheckCircleOutlined className="text-emerald-500 mt-1" />
                          )}
                        </div>
                      </div>
                    ))}
                </div>

                {/* Other addresses */}
                {showAddressList && (
                  <div className="mt-3 space-y-2 border border-gray-200 rounded-xl p-3">
                    {addresses
                      .filter((address) => !address.isDefault)
                      .map((address) => (
                        <div
                          key={address.addressId}
                          onClick={() => {
                            setSelectedAddress(address)
                            setShowAddressList(false)
                          }}
                          className={`p-3 rounded-lg cursor-pointer transition-all ${
                            selectedAddress?.addressId === address.addressId
                              ? 'bg-emerald-50 border border-emerald-300'
                              : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
                          }`}
                        >
                          <Text strong className="text-sm block">
                            {address.addressName}
                          </Text>
                          <Text className="text-xs text-gray-500">
                            {address.addressStreet}, {address.villageName}, {address.cityName}
                          </Text>
                        </div>
                      ))}
                  </div>
                )}

                {!showAddressList && addresses.filter((a) => !a.isDefault).length > 0 && (
                  <Button
                    type="link"
                    size="small"
                    onClick={() => setShowAddressList(true)}
                    className="!text-gray-500 !text-xs mt-2"
                  >
                    Chọn địa chỉ khác ({addresses.filter((a) => !a.isDefault).length})
                  </Button>
                )}
              </div>

              {showAddAddress && (
                <AddNewAddress
                  setShowAddAddress={setShowAddAddress}
                  redirectToProfile={false}
                  onSuccess={() => refreshAddresses()}
                />
              )}
            </div>
          </div>

          {/* Right - Order Summary */}
          <div className="lg:col-span-3 p-4 sm:p-5">
            <div className="space-y-4">
              {/* Products */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <ShopOutlined className="text-emerald-600 text-sm" />
                  </div>
                  <Text strong className="text-sm">
                    Sản phẩm ({cartItems.length})
                  </Text>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-xl"
                    >
                      <div className="min-w-0 flex-1">
                        <Text strong className="text-sm block truncate">
                          {item.productName}
                        </Text>
                        <Text className="text-xs text-gray-400">
                          {formatCurrency(item.subtotal / item.quantity)} x {item.quantity}
                        </Text>
                      </div>
                      <Text strong className="text-sm whitespace-nowrap text-emerald-700">
                        {formatCurrency(item.subtotal)}
                      </Text>
                    </div>
                  ))}
                </div>
              </div>

              <Divider style={{ margin: '8px 0' }} />

              {/* Voucher */}
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100">
                <div className="flex items-center gap-2 mb-3">
                  <GiftOutlined className="text-orange-500" />
                  <Text strong className="text-sm">
                    Mã giảm giá
                  </Text>
                </div>
                <div className="flex items-center gap-3">
                  <Select
                    placeholder="Chọn voucher"
                    allowClear
                    className="flex-1"
                    size="large"
                    onChange={(value) => {
                      const selected = vouchers.find((x) => x.voucherId === value)
                      setSelectedVoucher(selected ?? null)
                    }}
                  >
                    {vouchers.map((v) => (
                      <Select.Option key={v.voucherId} value={v.voucherId}>
                        {v.code} - Giảm {v.discountValue}%
                      </Select.Option>
                    ))}
                  </Select>
                  {valueSale > 0 && (
                    <Tag color="red" style={{ fontSize: 14, padding: '4px 12px', borderRadius: 8 }}>
                      -{formatCurrency(valueSale)}
                    </Tag>
                  )}
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCardOutlined className="text-blue-500" />
                    <Text strong className="text-sm">
                      Phương thức thanh toán
                    </Text>
                  </div>
                  <Tag
                    color="blue"
                    style={{ fontSize: 13, padding: '4px 12px', borderRadius: 8, margin: 0 }}
                  >
                    {paymentMethodName}
                  </Tag>
                </div>
              </div>

              <Divider style={{ margin: '8px 0' }} />

              {/* Total */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <Text className="text-gray-600">Tạm tính</Text>
                    <Text>{formatCurrency(totalPrice)}</Text>
                  </div>
                  {valueSale > 0 && (
                    <div className="flex justify-between text-sm">
                      <Text className="text-gray-600">Giảm giá</Text>
                      <Text type="danger">-{formatCurrency(valueSale)}</Text>
                    </div>
                  )}
                  <Divider style={{ margin: '8px 0' }} />
                  <div className="flex justify-between items-center">
                    <Text strong className="text-base">
                      Tổng thanh toán
                    </Text>
                    <Text strong className="text-xl" style={{ color: '#dc2626' }}>
                      {formatCurrency(totalPrice - valueSale)}
                    </Text>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="primary"
                size="large"
                block
                onClick={handleSubmitCheckout}
                className="!bg-emerald-600 !border-emerald-600 hover:!bg-emerald-700 !h-12 !text-base !font-semibold"
                style={{ borderRadius: 12 }}
              >
                Xác nhận đặt hàng
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
