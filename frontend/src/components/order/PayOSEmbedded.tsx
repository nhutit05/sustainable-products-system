import { useEffect, useMemo, useState } from 'react'
import QRCode from 'react-qr-code'
import { Copy, ExternalLink, CheckCircle2, Clock3, QrCode } from 'lucide-react'
import { useNotification } from '../../context/useNotification'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Space,
  Divider,
  Tag,
  Statistic,
  List,
  Descriptions,
  Alert,
  Progress,
  Flex,
} from 'antd'

import {
  CopyOutlined,
  LinkOutlined,
  CloseOutlined,
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
  console.log('PayOSEmbedded render')
  console.log(orderSummary)
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
  }, [orderId, paymentStatus])

  useEffect(() => {
    if (!expiredAt) return
    const target = new Date(expiredAt + 'Z').getTime()

    console.log('expiredAt =', expiredAt)
    console.log('target =', target)
    console.log('Date.now() =', Date.now())
    console.log('diff =', target - Date.now())

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
 return (
  <div className="fixed inset-0 z-52 bg-black/45 backdrop-blur-sm flex items-center justify-center p-6">
    <Card
      style={{
        width: '100%',
        maxWidth: 1500,
        height: '95vh',
        borderRadius: 20,
        overflow: 'hidden',
      }}
      styles={{
        body: {
          padding: 0,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg,#16a34a,#059669)',
          padding: 24,
          color: '#fff',
        }}
      >
        <Typography.Title
          level={2}
          style={{
            color: '#fff',
            marginBottom: 4,
          }}
        >
          Thanh toán đơn hàng
        </Typography.Title>

        <Typography.Text style={{ color: '#e8ffe8' }}>
          Quét QR bằng ứng dụng ngân hàng hoặc mở PayOS để hoàn tất thanh toán.
        </Typography.Text>
      </div>

      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: 24,
        }}
      >
        <Row gutter={24}>
          {/* LEFT */}
          <Col xs={24} xl={15}>
            <Space direction="vertical" style={{ width: '100%' }} size={24}>
              <Card
  bordered={false}
  style={{
    borderRadius: 24,
    textAlign: 'center',
    background: '#f8fafc',
    border: '1px solid #e5e7eb',
  }}
>
  <Space
    direction="vertical"
    size={20}
    style={{
      width: '100%',
      alignItems: 'center',
    }}
  >
    <Tag
      color="green"
      style={{
        fontSize: 14,
        padding: '6px 18px',
        borderRadius: 20,
      }}
    >
      Quét mã để thanh toán
    </Tag>

    <div
      style={{
        background: '#fff',
        padding: 22,
        borderRadius: 24,
        boxShadow:
          '0 10px 35px rgba(0,0,0,.08)',
      }}
    >
      <QRCode value={qrCode} size={300} />
    </div>

    <Typography.Text type="secondary">
      Mở ứng dụng ngân hàng hoặc ví điện tử hỗ trợ QR để quét mã
    </Typography.Text>
  </Space>
</Card>

              <Card
                title={
                  <Flex align="center" gap={8}>
                    <QrCode size={18} />
                    Liên kết thanh toán
                  </Flex>
                }
                style={{ borderRadius: 18 }}
              >
                <Typography.Paragraph copyable>
                  {checkoutUrl}
                </Typography.Paragraph>

                <Divider />

                <Flex justify="space-between" align="center">
                  <Typography.Text type="secondary">
                    Mã đơn hàng
                  </Typography.Text>

                  <Tag color="green" style={{ fontSize: 18, padding: '6px 18px' }}>
                    #{orderId}
                  </Tag>
                </Flex>
              </Card>
            </Space>
          </Col>

          {/* RIGHT */}
          <Col xs={24} xl={9}>
            <Space
              direction="vertical"
              style={{ width: '100%' }}
              size={20}
            >
              {/* Countdown */}

              <Card
                style={{
                  borderRadius: 18,
                }}
              >
                <Statistic.Countdown
                  title="Thời gian còn lại"
                  value={Date.now() + remainingSeconds * 1000}
                  format="mm:ss"
                  valueStyle={{
                    color: '#cf1322',
                    fontWeight: 800,
                    fontSize: 46,
                  }}
                />

                <Progress
                  percent={(remainingSeconds / (15 * 60)) * 100}
                  showInfo={false}
                  strokeColor="#16a34a"
                />
              </Card>

              {/* Status */}

              {paymentStatus === 'PAID' ? (
                <Alert
                  showIcon
                  type="success"
                  message="Đã thanh toán"
                  description="Hệ thống đã xác nhận giao dịch."
                />
              ) : paymentStatus === 'EXPIRED' ? (
                <Alert
                  showIcon
                  type="error"
                  message="QR đã hết hạn"
                  description="Liên kết thanh toán đã hết hạn."
                />
              ) : (
                <Alert
                  showIcon
                  type="warning"
                  message="Đang chờ thanh toán..."
                  description="Trạng thái sẽ tự động cập nhật."
                />
              )}

              {/* Order */}

              <Card
                title="Thông tin đơn hàng"
                style={{ borderRadius: 18 }}
              >
                <Descriptions
                  column={1}
                  size="small"
                  bordered
                >
                  <Descriptions.Item label="Người nhận">
                    {orderSummary.receiver}
                  </Descriptions.Item>

                  <Descriptions.Item label="Số điện thoại">
                    {orderSummary.phone}
                  </Descriptions.Item>

                  <Descriptions.Item label="Địa chỉ">
                    {orderSummary.address}
                  </Descriptions.Item>

                  <Descriptions.Item label="Thanh toán">
                    {orderSummary.paymentMethod}
                  </Descriptions.Item>
                </Descriptions>
              </Card>

              {/* Product */}

              <Card
                title="Sản phẩm"
                style={{
                  borderRadius: 18,
                }}
              >
                <List
                  dataSource={orderSummary.items}
                  style={{
                    maxHeight: 280,
                    overflow: 'auto',
                  }}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        title={item.productName}
                        description={`Số lượng: ${item.quantity}`}
                      />

                      <Typography.Text strong>
                        {Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        }).format(item.productPrice)}
                      </Typography.Text>
                    </List.Item>
                  )}
                />

                <Divider />

                <Flex justify="space-between">
                  <Typography.Text>Giảm giá</Typography.Text>

                  <Typography.Text style={{ color: '#f5222d' }}>
                    -
                    {Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(orderSummary.discount)}
                  </Typography.Text>
                </Flex>

                <Divider />

                <Flex justify="space-between">
                  <Typography.Title level={4} style={{ margin: 0 }}>
                    Tổng tiền
                  </Typography.Title>

                  <Typography.Title
                    level={3}
                    style={{
                      margin: 0,
                      color: '#16a34a',
                    }}
                  >
                    {Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(orderSummary.total)}
                  </Typography.Title>
                </Flex>
              </Card>

              {/* Buttons */}

              <Space direction="vertical" style={{ width: '100%' }}>
                <Button
                  type="primary"
                  size="large"
                  icon={<CopyOutlined />}
                  onClick={copyCheckoutLink}
                  block
                >
                  {copied
                    ? 'Đã sao chép liên kết'
                    : 'Sao chép link thanh toán'}
                </Button>

                <Button
                  size="large"
                  icon={<LinkOutlined />}
                  onClick={openPayOS}
                  block
                >
                  Mở trang PayOS
                </Button>

                <Button
                  danger
                  icon={<CloseOutlined />}
                  size="large"
                  onClick={() => setOnClose(true)}
                  block
                >
                  Đóng
                </Button>
              </Space>
            </Space>
          </Col>
        </Row>
      </div>
    </Card>
  </div>
)
}
