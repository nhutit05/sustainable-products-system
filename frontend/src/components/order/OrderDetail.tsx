import { Modal } from 'antd'
import type { OrderResponse } from '../../model/checkout.model'
import { OrderStatusColor, OrderStatusIcon, OrderStatusName } from '../../enum/OrderStatus.enum'
import {
  MapPin,
  Phone,
  User,
  CreditCard,
  Ticket,
  Package,
  Receipt,
  Calendar,
  X,
} from 'lucide-react'

interface OrderDetailProps {
  order: OrderResponse
  setOnClose: (value: boolean) => void
}

export default function OrderDetail({ order, setOnClose }: OrderDetailProps) {
  const Icon = OrderStatusIcon[order.orderStatusName as keyof typeof OrderStatusIcon]

  const formatted = (dateString: string) =>
    new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Ho_Chi_Minh',
    }).format(new Date(dateString))

  const isPaid =
    order.paymentStatusName?.toUpperCase().includes('PAID') ||
    order.paymentStatusName?.toUpperCase().includes('SUCCESS') ||
    order.paymentStatusName?.toUpperCase().includes('THÀNH CÔNG')

  const handleCancelOrder = (orderId: number) => {
    // Implement the logic to cancel the order here
    console.log(`Cancel order with ID: ${orderId}`)
    // You can call an API or update the state accordingly
  }

  return (
    <Modal
      open={true}
      onCancel={() => setOnClose(false)}
      footer={null}
      closeIcon={
        <span className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-all">
          <X className="w-4 h-4 text-gray-500" />
        </span>
      }
      centered
      width={640}
      className="order-detail-modal"
    >
      <div className="pt-1">
        {/* HEADER */}
        <div className="flex items-center justify-between gap-3 pb-4 mb-4 border-b border-emerald-100">
          <div>
            <p className="text-xs font-semibold text-emerald-500 uppercase tracking-wider mb-1">
              Chi tiết đơn hàng
            </p>
            <h2 className="text-xl font-bold text-green-900">#{order.orderId}</h2>
            <p className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatted(order.orderedAt)}
            </p>
          </div>

          <span
            className={
              OrderStatusColor[order.orderStatusName as keyof typeof OrderStatusColor] +
              ' border px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0'
            }
          >
            <Icon className="w-4 h-4" />
            {OrderStatusName[order.orderStatusName as keyof typeof OrderStatusName]}
          </span>
        </div>

        {/* RECEIVER + PAYMENT INFO */}
        <div className="grid sm:grid-cols-2 gap-3 mb-5">
          {/* Receiver info */}
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4">
            <h3 className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wide mb-3">
              <User className="w-4 h-4" />
              Người nhận
            </h3>
            <p className="text-sm font-semibold text-gray-800">{order.orderReceiver}</p>
            <p className="flex items-center gap-1.5 text-sm text-gray-600 mt-1.5">
              <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              {order.orderReceiverPhone}
            </p>
            <p className="flex items-start gap-1.5 text-sm text-gray-600 mt-1.5">
              <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
              {order.orderAddress
                ? order.orderAddress.substring(0, 50) + '...'
                : order.orderAddress}
            </p>
          </div>

          {/* Payment info */}
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4">
            <h3 className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wide mb-3">
              <CreditCard className="w-4 h-4" />
              Thanh toán
            </h3>
            <p className="text-sm text-gray-600">
              Phương thức:{' '}
              <span className="font-semibold text-gray-800">{order.paymentMethodName}</span>
            </p>
            <p className="text-sm text-gray-600 mt-1.5 flex items-center gap-2">
              Trạng thái:
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${
                  isPaid
                    ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                    : 'bg-amber-100 text-amber-700 border-amber-200'
                }`}
              >
                {order.paymentStatusName}
              </span>
            </p>
            {order.voucherCode && (
              <p className="flex items-center gap-1.5 text-sm text-gray-600 mt-1.5">
                <Ticket className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                Mã giảm giá:{' '}
                <span className="font-semibold text-gray-800">{order.voucherCode}</span>
              </p>
            )}
          </div>
        </div>

        {/* ITEMS */}
        <div className="mb-5">
          <h3 className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wide mb-3">
            <Package className="w-4 h-4" />
            Sản phẩm ({order.items.length})
          </h3>

          <div className="rounded-2xl border border-emerald-100 overflow-hidden divide-y divide-emerald-50">
            {order.items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center justify-between gap-3 px-4 py-3 bg-white hover:bg-emerald-50/40 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{item.productName}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {item.quantity} × {item.purchasedPrice.toLocaleString('vi-VN')}₫
                  </p>
                </div>
                <p className="text-sm font-bold text-green-900 whitespace-nowrap shrink-0">
                  {item.subTotal.toLocaleString('vi-VN')}₫
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* TOTAL */}
        <div className="flex items-center justify-between rounded-2xl bg-linear-to-r from-emerald-500 to-teal-600 px-5 py-4">
          <span className="flex items-center gap-2 text-sm font-semibold text-white/90">
            <Receipt className="w-4 h-4" />
            Tổng thanh toán
          </span>
          <span className="text-xl font-bold text-white">
            {order.totalAmount.toLocaleString('vi-VN')}₫
          </span>
        </div>
      </div>

      {/* BUTTON CANCEL ORDER */}
      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={() => handleCancelOrder(order.orderId)}
          className="px-4 py-2 border border-red-400 rounded-xl text-sm font-semibold text-red-600 hover:text-red-800 transition-colors
          hover:cursor-pointer hover:bg-red-50 active:scale-97 active:transition-transform"
        >
          Hủy đơn hàng
        </button>
      </div>
    </Modal>
  )
}
