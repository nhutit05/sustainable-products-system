import { useEffect, useState } from 'react'
import QRCode from 'react-qr-code'
import { useNotification } from '../../context/useNotification'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  Typography,
  Button,
  Divider,
  Tag,
  Alert,
  Progress,
  Flex,
  List,
} from 'antd'
import {
  CopyOutlined,
  LinkOutlined,
  CloseOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  DollarOutlined,
  UserOutlined,
  PhoneOutlined,
  HomeOutlined,
  CreditCardOutlined,
} from '@ant-design/icons'

const { Text } = Typography

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
            message="Thanh toán thành công"
            description="Đơn hàng của bạn đã được xác nhận."
            style={{ borderRadius: 10 }}
          />
        )
      case 'EXPIRED':
        return (
          <Alert
            showIcon
            type="error"
            message="QR đã hết hạn"
            description="Vui lòng tạo đơn hàng mới."
            style={{ borderRadius: 10 }}
          />
        )
      default:
        return (
          <Alert
            showIcon
            type="warning"
            message="Đang chờ thanh toán"
            description="Quét QR hoặc mở link để thanh toán."
            style={{ borderRadius: 10 }}
          />
        )
    }
  }

  return (
    <div className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6">
      {/* Full-screen scrollable container */}
      <div className="w-full max-w-6xl h-full max-h-[95vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div
          className="px-4 py-3 sm:px-6 sm:py-4 shrink-0"
          style={{ background: 'linear-gradient(135deg, #16a34a, #059669)' }}
        >
          <Flex justify="space-between" align="center" wrap="wrap" gap={8}>
            <div className="min-w-0">
              <Text strong style={{ color: '#fff', fontSize: 18 }}>
                Thanh toán đơn hàng #{orderId}
              </Text>
              <div>
                <Text style={{ color: '#d1fae5', fontSize: 12 }}>
                  Quét QR hoặc mở link để hoàn tất thanh toán
                </Text>
              </div>
            </div>
            <Tag
              color={paymentStatus === 'PAID' ? 'success' : paymentStatus === 'EXPIRED' ? 'error' : 'warning'}
              style={{ fontSize: 12, padding: '2px 10px', borderRadius: 20, margin: 0 }}
            >
              {paymentStatus === 'PAID' ? 'Đã thanh toán' : paymentStatus === 'EXPIRED' ? 'Hết hạn' : 'Chờ thanh toán'}
            </Tag>
          </Flex>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 lg:gap-0">
            {/* Left column - QR & Link */}
            <div className="lg:col-span-3 p-4 sm:p-5 lg:border-r border-gray-100 space-y-4">
              {/* QR Code */}
              <div className="flex flex-col items-center gap-3 py-4">
                <div className="bg-white p-4 rounded-xl" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                  <QRCode value={qrCode} size={220} />
                </div>
                <Text type="secondary" className="text-xs text-center">
                  Mở ứng dụng ngân hàng hoặc ví điện tử hỗ trợ QR
                </Text>
              </div>

              {/* Payment Link */}
              <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                <Flex align="center" gap={8} className="mb-2">
                  <LinkOutlined className="text-emerald-600" />
                  <Text strong className="text-sm">Liên kết thanh toán</Text>
                </Flex>
                <div
                  className="p-2.5 rounded-lg text-xs break-all mb-3"
                  style={{ background: '#fff', border: '1px solid #e5e7eb', fontFamily: 'monospace', wordBreak: 'break-all' }}
                >
                  {checkoutUrl}
                </div>
                <Flex gap={8} wrap="wrap">
                  <Button
                    type="primary"
                    size="small"
                    icon={<CopyOutlined />}
                    onClick={copyCheckoutLink}
                    className="!bg-emerald-600 !border-emerald-600"
                  >
                    {copied ? 'Đã sao chép' : 'Sao chép'}
                  </Button>
                  <Button size="small" icon={<LinkOutlined />} onClick={openPayOS}>
                    Mở PayOS
                  </Button>
                </Flex>
              </div>
            </div>

            {/* Right column - Status & Summary */}
            <div className="lg:col-span-2 p-4 sm:p-5 space-y-3">
              {/* Countdown */}
              <div className="bg-red-50 rounded-xl p-4 text-center">
                <Flex justify="center" align="center" gap={6} className="mb-1">
                  <ClockCircleOutlined className="text-red-500" />
                  <Text type="secondary" className="text-xs">Thời gian còn lại</Text>
                </Flex>
                <div className="text-3xl sm:text-4xl font-bold text-red-600 mb-2" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {minutes}:{seconds}
                </div>
                <Progress
                  percent={(remainingSeconds / (15 * 60)) * 100}
                  showInfo={false}
                  strokeColor="#16a34a"
                  size="small"
                />
              </div>

              {/* Status */}
              {getStatusAlert()}

              {/* Order Info */}
              <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                <Flex align="center" gap={8} className="mb-3">
                  <DollarOutlined className="text-emerald-600" />
                  <Text strong className="text-sm">Thông tin đơn hàng</Text>
                </Flex>
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between items-start gap-2">
                    <Flex gap={6} align="center" className="text-gray-500 shrink-0">
                      <UserOutlined /> <span className="hidden sm:inline">Người nhận</span>
                    </Flex>
                    <Text strong className="text-right">{orderSummary.receiver}</Text>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <Flex gap={6} align="center" className="text-gray-500 shrink-0">
                      <PhoneOutlined /> <span className="hidden sm:inline">Điện thoại</span>
                    </Flex>
                    <Text>{orderSummary.phone}</Text>
                  </div>
                  <div className="flex justify-between items-start gap-2">
                    <Flex gap={6} align="center" className="text-gray-500 shrink-0">
                      <HomeOutlined /> <span className="hidden sm:inline">Địa chỉ</span>
                    </Flex>
                    <Text className="text-right break-words">{orderSummary.address}</Text>
                  </div>
                  <Divider style={{ margin: '6px 0' }} />
                  <div className="flex justify-between items-center gap-2">
                    <Flex gap={6} align="center" className="text-gray-500 shrink-0">
                      <CreditCardOutlined /> <span className="hidden sm:inline">Thanh toán</span>
                    </Flex>
                    <Tag color="blue" style={{ margin: 0 }}>{orderSummary.paymentMethod}</Tag>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                <Flex align="center" gap={8} className="mb-3">
                  <DollarOutlined className="text-emerald-600" />
                  <Text strong className="text-sm">Sản phẩm ({orderSummary.items.length})</Text>
                </Flex>
                <div className="space-y-2 max-h-36 overflow-y-auto">
                  {orderSummary.items.map((item) => (
                    <div key={item.productId} className="flex justify-between items-center gap-2 bg-white rounded-lg px-3 py-2">
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium truncate">{item.productName}</div>
                        <div className="text-xs text-gray-400">x{item.quantity}</div>
                      </div>
                      <Text strong className="text-sm whitespace-nowrap">
                        {formatCurrency(item.subtotal)}
                      </Text>
                    </div>
                  ))}
                </div>
                <Divider style={{ margin: '10px 0 6px' }} />
                {orderSummary.discount > 0 && (
                  <>
                    <div className="flex justify-between text-sm mb-1">
                      <Text type="secondary">Giảm giá</Text>
                      <Text type="danger">-{formatCurrency(orderSummary.discount)}</Text>
                    </div>
                    <Divider style={{ margin: '6px 0' }} />
                  </>
                )}
                <div className="flex justify-between items-center">
                  <Text strong>Tổng cộng</Text>
                  <Text strong className="text-lg" style={{ color: '#16a34a' }}>
                    {formatCurrency(orderSummary.total)}
                  </Text>
                </div>
              </div>

              {/* Close Button */}
              <Button
                danger
                icon={<CloseOutlined />}
                onClick={() => setOnClose(true)}
                block
                size="large"
                style={{ borderRadius: 10 }}
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
