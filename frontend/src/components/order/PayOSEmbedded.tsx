import { useEffect, useState } from 'react'
import QRCodeCanvas from './QRCodeCanvas'
import { useNotification } from '../../context/useNotification'
import { useNavigate } from 'react-router-dom'
import { Button, Tag, Alert, Progress } from 'antd'
import {
  CopyOutlined,
  LinkOutlined,
  CloseOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  UserOutlined,
  PhoneOutlined,
  HomeOutlined,
  CreditCardOutlined,
  ShoppingOutlined,
  QrcodeOutlined,
} from '@ant-design/icons'

interface OrderSummary {
  items: {
    productId: number
    productName: string
    quantity: number
    productPrice: number
    subtotal: number
  }[]
  total: number
  discount: number
  paymentMethod: string
  receiver: string
  phone: string
  address: string
}

interface PayOSEmbeddedProps {
  checkoutUrl: string
  orderId: number
  qrCode: string
  expiredAt: string | null
  setOnClose: (value: boolean) => void
  orderSummary: OrderSummary
}

export default function PayOSEmbedded({
  checkoutUrl,
  orderId,
  qrCode,
  expiredAt,
  setOnClose,
  orderSummary,
}: PayOSEmbeddedProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(15 * 60)
  const [copied, setCopied] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'PENDING' | 'PAID' | 'EXPIRED'>('PENDING')
  const { showNotification } = useNotification()
  const navigate = useNavigate()

  useEffect(() => {
    if (paymentStatus !== 'PENDING') return
    const timer = setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        if (!response.ok) return
        const order = await response.json()
        if (order.paymentStatusName === 'PAID') {
          setPaymentStatus('PAID')
          clearInterval(timer)
          showNotification({
            message: 'Thanh toán thành công!',
            type: 'SUCCESS',
            duration: 3000,
          })
          setTimeout(() => {
            setOnClose(true)
            navigate('/')
          }, 1500)
        }
      } catch (err) {
        console.error(err)
      }
    }, 2000)
    return () => clearInterval(timer)
  }, [orderId, paymentStatus, showNotification, navigate, setOnClose])

  useEffect(() => {
    if (!expiredAt) return
    const target = new Date(expiredAt + 'Z').getTime()
    const update = () => {
      const diff = Math.max(0, Math.floor((target - Date.now()) / 1000))
      setRemainingSeconds(diff)
      if (diff <= 0) {
        setPaymentStatus('EXPIRED')
      }
    }
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [expiredAt])

  const minutes = String(Math.floor(remainingSeconds / 60)).padStart(2, '0')
  const seconds = String(remainingSeconds % 60).padStart(2, '0')

  const copyCheckoutLink = async () => {
    try {
      await navigator.clipboard.writeText(checkoutUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error(err)
    }
  }

  const openPayOS = () => {
    window.open(checkoutUrl, '_blank')
  }

  const formatCurrency = (value: number) =>
    Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)

  const getStatusAlert = () => {
    switch (paymentStatus) {
      case 'PAID':
        return (
          <Alert
            showIcon
            icon={<CheckCircleOutlined />}
            type="success"
            title="Thanh toán thành công!"
            description="Đơn hàng của bạn đã được xác nhận."
            style={{ borderRadius: 12 }}
          />
        )
      case 'EXPIRED':
        return (
          <Alert
            showIcon
            type="error"
            title="QR đã hết hạn"
            description="Vui lòng quay lại và tạo đơn hàng mới."
            style={{ borderRadius: 12 }}
          />
        )
      default:
        return (
          <Alert
            showIcon
            type="info"
            title="Đang chờ thanh toán"
            description="Vui lòng quét QR trong vòng 15 phút."
            style={{ borderRadius: 12 }}
          />
        )
    }
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-4 md:p-6"
      style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(5,150,105,0.1) 100%), rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
    >
      <div className="w-full max-w-6xl max-h-[95vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="relative px-5 py-4 sm:px-8 sm:py-5 shrink-0 overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)' }}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-white/20" />
            <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-white/10" />
          </div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <QrcodeOutlined className="text-white text-xl" />
              </div>
              <div>
                <h2 className="text-white text-lg sm:text-xl font-bold m-0">
                  Thanh toán đơn hàng
                </h2>
                <p className="text-emerald-100 text-xs sm:text-sm m-0 mt-0.5">
                  Mã đơn: <span className="font-semibold">#{orderId}</span>
                </p>
              </div>
            </div>
            <Tag
              color={paymentStatus === 'PAID' ? 'success' : paymentStatus === 'EXPIRED' ? 'error' : 'warning'}
              className="!text-xs !px-3 !py-1 !rounded-full !font-medium !border-0 !shadow-lg"
            >
              {paymentStatus === 'PAID' ? '✓ Đã thanh toán' : paymentStatus === 'EXPIRED' ? '✕ Hết hạn' : '● Chờ thanh toán'}
            </Tag>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5">
            {/* Left - QR Code */}
            <div className="lg:col-span-3 p-5 sm:p-6 lg:p-8 lg:border-r border-gray-100">
              <div className="flex flex-col items-center">
                {/* QR Code Card */}
                <div className="relative w-full max-w-sm">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl opacity-10 blur-xl" />
                  <div className="relative bg-white rounded-3xl p-6 sm:p-8 border border-gray-100"
                    style={{ boxShadow: '0 20px 60px rgba(16,185,129,0.15), 0 4px 20px rgba(0,0,0,0.05)' }}
                  >
                    <div className="text-center mb-4">
                      <div className="inline-flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full mb-4">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-emerald-700 text-xs font-medium">Đang chờ quét mã</span>
                      </div>
                      <h3 className="text-gray-800 text-base font-bold m-0">Quét mã QR</h3>
                      <p className="text-gray-400 text-xs m-0 mt-1">Sử dụng ứng dụng ngân hàng hoặc ví điện tử</p>
                    </div>
                    <div className="flex justify-center p-4 bg-gray-50 rounded-2xl">
                      <QRCodeCanvas value={qrCode} size={200} />
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-gray-400 text-xs m-0">
                        Hỗ trợ: VNPAY, VietQR, các ngân hàng nội địa
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Link */}
                <div className="w-full max-w-sm mt-5">
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <div className="flex items-center gap-2 mb-3">
                      <LinkOutlined className="text-emerald-600" />
                      <span className="text-gray-700 text-sm font-semibold">Link thanh toán</span>
                    </div>
                    <div className="bg-white rounded-xl p-3 border border-gray-200 mb-3">
                      <p className="text-xs text-gray-500 m-0 break-all font-mono leading-relaxed">
                        {checkoutUrl}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="primary"
                        size="middle"
                        icon={<CopyOutlined />}
                        onClick={copyCheckoutLink}
                        className="!bg-emerald-600 !border-emerald-600 hover:!bg-emerald-700 !rounded-xl !font-medium flex-1"
                      >
                        {copied ? '✓ Đã sao chép' : 'Sao chép link'}
                      </Button>
                      <Button
                        size="middle"
                        icon={<LinkOutlined />}
                        onClick={openPayOS}
                        className="!rounded-xl !font-medium"
                      >
                        Mở PayOS
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Order Summary */}
            <div className="lg:col-span-2 p-5 sm:p-6 bg-gray-50/50">
              {/* Countdown */}
              <div className="relative bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl p-5 text-center mb-4 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/30" />
                </div>
                <div className="relative">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <ClockCircleOutlined className="text-white/80" />
                    <span className="text-white/80 text-xs font-medium uppercase tracking-wider">Thời gian còn lại</span>
                  </div>
                  <div className="text-white text-4xl sm:text-5xl font-bold mb-3" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {minutes}:{seconds}
                  </div>
                  <Progress
                    percent={(remainingSeconds / (15 * 60)) * 100}
                    showInfo={false}
                    strokeColor="rgba(255,255,255,0.8)"
                    railColor="rgba(255,255,255,0.2)"
                    size="small"
                  />
                </div>
              </div>

              {/* Status */}
              <div className="mb-4">
                {getStatusAlert()}
              </div>

              {/* Order Info */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 mb-4"
                style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                    <CreditCardOutlined className="text-blue-500 text-sm" />
                  </div>
                  <span className="text-gray-800 text-sm font-bold">Thông tin giao hàng</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
                      <UserOutlined className="text-emerald-600 text-xs" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-400 m-0 mb-0.5">Người nhận</p>
                      <p className="text-sm font-semibold text-gray-800 m-0">{orderSummary.receiver}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
                      <PhoneOutlined className="text-emerald-600 text-xs" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-400 m-0 mb-0.5">Điện thoại</p>
                      <p className="text-sm font-semibold text-gray-800 m-0">{orderSummary.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
                      <HomeOutlined className="text-emerald-600 text-xs" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-400 m-0 mb-0.5">Địa chỉ</p>
                      <p className="text-sm font-semibold text-gray-800 m-0 break-words">{orderSummary.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
                      <CreditCardOutlined className="text-emerald-600 text-xs" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-400 m-0 mb-0.5">Phương thức</p>
                      <Tag color="blue" className="!m-0 !rounded-lg !text-xs">{orderSummary.paymentMethod}</Tag>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 mb-4"
                style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center">
                    <ShoppingOutlined className="text-orange-500 text-sm" />
                  </div>
                  <span className="text-gray-800 text-sm font-bold">Sản phẩm ({orderSummary.items.length})</span>
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                  {orderSummary.items.map((item) => (
                    <div key={item.productId} className="flex items-center justify-between gap-2 p-2.5 bg-gray-50 rounded-xl">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-800 m-0 truncate">{item.productName}</p>
                        <p className="text-xs text-gray-400 m-0">x{item.quantity}</p>
                      </div>
                      <span className="text-sm font-bold text-emerald-700 whitespace-nowrap">
                        {formatCurrency(item.subtotal)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-100 mt-3 pt-3 space-y-2">
                  {orderSummary.discount > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Giảm giá</span>
                      <span className="font-semibold text-red-500">-{formatCurrency(orderSummary.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-800 font-bold">Tổng thanh toán</span>
                    <span className="text-xl font-bold" style={{ color: '#10b981' }}>
                      {formatCurrency(orderSummary.total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <Button
                ghost
                danger
                icon={<CloseOutlined />}
                onClick={() => setOnClose(true)}
                block
                size="large"
                className="!rounded-xl !h-11 !font-medium"
              >
                Đóng
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
