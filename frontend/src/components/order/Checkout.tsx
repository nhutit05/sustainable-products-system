import { useEffect, useState } from 'react'
import type { CartItemResponse } from '../../model/cart.model'
import { X } from 'lucide-react'
import type { voucherResponse } from '../../model/voucher.model'
import { PaymentMethodName } from '../../enum/PaymentMethod.enum'
import { useNavigate } from 'react-router-dom'
import { useNotification } from '../../context/useNotification'
import type { Addressresponse } from '../../model/address.model'
import AddNewAddress from '../admin/AddNewAddress'
import PayOSEmbedded from './PayOSEmbedded'
import {notification} from "antd";
import {
  Modal,
  Card,
  Row,
  Col,
  Typography,
  Input,
  Button,
  Select,
  Table,
  Space,
  Tag,
  Divider
} from "antd";

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
        // showNotification({
        //   message: 'Đặt hàng thất bại. Vui lòng thử lại.',
        //   type: 'ERROR',
        //   duration: 3000,
        // })
        notification.error({
         title: "Đặt hàng thất bại",
         description: "Vui lòng thử lại"
        })
        return
      }

      // COD

      if (!result.checkoutUrl) {
        // showNotification({
        //   message: 'Đặt hàng thành công!',
        //   type: 'SUCCESS',
        //   duration: 3000,
        // })

        notification.success({
         title: "Đặt hàng thành công",
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

      // showNotification({
      //   message: 'Có lỗi xảy ra khi đặt hàng.',
      //   type: 'ERROR',
      //   duration: 3000,
      // })

      notification.error({
        title: "Có lỗi khi đặt hàng."
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

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "productName"
    },
    {
      title: "Số lượng",
      dataIndex: "quantity"
    },
    {
      title: "Đơn giá",
      render: (_: any, item: CartItemResponse) =>
        Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND"
        }).format(item.subtotal / item.quantity)
    },
    {
      title: "Thành tiền",
      render: (_: any, item: CartItemResponse) =>
        Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND"
        }).format(item.subtotal)
    }
  ]

  return (

    <Modal
      open
      footer={null}
      width={1200}
      zIndex={99}
      centered
      onCancel={() => setOnClose(true)}
    >
      <Typography.Title
        level={2}
        style={{
          textAlign: "center",
          marginBottom: 30
        }}
      >
        Xác nhận đơn đặt hàng
      </Typography.Title>
      <Row gutter={24}>
        <Col span={8}>
          <Card
            title="Thông tin người nhận"
            bordered={false}
          >
            {/* <h2 className="text-xl font-bold text-green-900">Thông tin người nhận</h2> */}

            <div>
              <label className="block font-semibold text-green-900 mb-2">Tên người nhận</label>

              <Input
                value={orderReceiver}
                onChange={(e) => setOrderReceiver(e.target.value)}
                placeholder="Nhập tên người nhận"
                size="large"
              />
            </div>

            <div>
              <label className="block font-semibold text-green-900 mb-2">Số điện thoại</label>

              <Input
                value={orderReceiverPhone}
                onChange={(e) => setOrderReceiverPhone(e.target.value)}
                placeholder="Nhập số điện thoại"
                size="large"
              />
            </div>

            <h3 className="text-xl font-bold text-green-900 mt-5">Địa chỉ giao hàng</h3>

            {addresses
              .filter((address) => address.isDefault)
              .map((address) => (
                <Card
                  hoverable
                  style={{
                    marginTop: 12,
                    marginBottom: 12,
                    cursor: "pointer",
                    border:
                      selectedAddress?.addressId === address.addressId
                        ? "2px solid #1677ff"
                        : ""
                  }}
                  onClick={() => {
                    setSelectedAddress(address)
                  }}
                >
                  <Space>

                    <Typography.Text strong>

                      {address.addressName}

                    </Typography.Text>

                    {address.isDefault && (
                      <Tag color="green">
                        Mặc định
                      </Tag>
                    )}

                  </Space>

                  <p className="text-sm text-gray-600">
                    {address.addressStreet}, {address.villageName}, {address.cityName}
                  </p>
                </Card>
              ))}

            <Button
              type="link"
              // className="text-sm font-bold text-gray-500 hover:underline"
              onClick={() => setShowAddressList(!showAddressList)}
            >
              -- Chọn địa chỉ khác --
            </Button>

            {showAddressList && (
              <div className="border border-slate-200 rounded-xl p-3 space-y-2 mt-5">
                {addresses.map((address) => (
                  <button
                    key={address.addressId}
                    type="button"
                    className="block w-full text-left p-3 rounded-xl hover:bg-emerald-50"
                    onClick={() => {
                      setSelectedAddress(address)
                      setShowAddressList(false)
                    }}
                  >
                    <p className="font-semibold">{address.addressName}</p>

                    <p className="text-sm">
                      {address.addressStreet}, {address.villageName}, {address.cityName}
                    </p>
                  </button>
                ))}

                <Button
                  type='dashed'
                  // className="text-sm text-gray-500 hover:underline"
                  onClick={() => {
                    setShowAddressList(false)
                    setShowAddAddress(true)
                  }}
                >
                  + Thêm địa chỉ mới
                </Button>
              </div>
            )}

            {showAddAddress && (
              <AddNewAddress
                setShowAddAddress={setShowAddAddress}
                redirectToProfile={false}
                onSuccess={() => refreshAddresses()}
              />
            )}
          </Card>
        </Col>

        <Col span={16}>
          <Card
            title="Thông tin đơn hàng"
          >
            {/* <h2 className="text-xl font-bold text-green-900">Thông tin đơn hàng</h2> */}

            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <Table
                columns={columns}
                dataSource={cartItems}
                pagination={false}
                rowKey="productId"
              />
            </div>

            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl mt-5">
              <label className="font-semibold text-green-900">Mã giảm giá</label>

              <Select
                style={{ width: "100%" }}
                placeholder="Chọn voucher"
                allowClear
                onChange={(value) => {
                  const selected = vouchers.find(
                    x => x.voucherId === value
                  )

                  setSelectedVoucher(selected ?? null)
                }}
              >
                <option value="">Chọn voucher</option>

                {vouchers.map(v => (
                  <Select.Option
                    key={v.voucherId}
                    value={v.voucherId}
                  >
                    {v.code} - {v.discountValue}%
                  </Select.Option>
                ))}
              </Select>

              <span className="font-bold text-red-500">
                -
                {Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                }).format(valueSale)}
              </span>
            </div>

            <div className="flex justify-between items-center bg-emerald-50 p-4 rounded-2xl mt-5 mb-5">
              <span className="font-semibold text-green-900">Phương thức thanh toán</span>

              <span className="font-bold text-green-700">{paymentMethodName}</span>
            </div>

            <Card
              style={{
                background: "#f6ffed",
                border: "1px solid #b7eb8f",
                marginTop: 10
              }}
            >
              <Row justify="space-between">

                <Col>

                  <Typography.Title level={4}>
                    Tổng thanh toán
                  </Typography.Title>

                </Col>

                <Col>

                  <Typography.Title
                    level={3}
                    style={{
                      color: "#cf1322",
                      marginBottom: 10
                    }}
                  >
                    {Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(totalPrice - valueSale)}
                  </Typography.Title>
                </Col>
              </Row>
            </Card>

            <Button
              type="primary"
              size="large"
              block
              style={{
                height: 52,
                fontWeight: 700,
                marginTop: 20
              }}
              onClick={handleSubmitCheckout}
            >
              Xác nhận thanh toán
            </Button>
          </Card>
        </Col>
      </Row>
    </Modal>
  )
}
