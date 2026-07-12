import { useEffect, useState } from 'react'
import { useCustomer } from '../context/useCustomer'
import type { OrderResponse } from '../model/checkout.model'
import { OrderStatusColor, OrderStatusIcon, OrderStatusName } from '../enum/OrderStatus.enum'
import { ArrowRight, Download } from 'lucide-react'

export default function MyOrder() {
  const { token } = useCustomer()

  const [loading, setLoading] = useState<boolean>(false)

  const [orders, setOrders] = useState<OrderResponse[]>([])

  const orderStatus = [
    { index: -1, id: 'ALL', name: 'Tất cả' },
    { index: 0, id: 'PENDING', name: 'Đang chờ xử lý' },
    { index: 1, id: 'SHIPPING', name: 'Đang giao hàng' },
    { index: 2, id: 'CONFIRMED', name: 'Đã xác nhận' },
    { index: 3, id: 'COMPLETED', name: 'Đã hoàn thành' },
    { index: 4, id: 'CANCELLED', name: 'Đã hủy' },
  ]

  const [selectedStatus, setSelectedStatus] = useState<number>(-1)

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      try {
        const response = await fetch('http://localhost:8080/api/orders', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        if (!response.ok) {
          throw new Error('Failed to fetch orders')
        }
        const data = await response.json()
        setOrders(data)
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchOrders()
    }
  }, [token])

  const formatted = (dateString: string) =>
    new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'Asia/Ho_Chi_Minh',
    }).format(new Date(dateString))

  return (
    <div className="myOrder text-left">
      <h2 className="text-green-900 text-lg font-semibold mb-2 px-2">
        Quản lý đơn hàng cá nhân
        <span className="text-sm text-emerald-500 font-medium mr-2">
          {' '}
          ({orders.length}) đơn hàng
        </span>
      </h2>

      {/* ORDER STATUS FILTER */}
      <div className="orderStatusFilter p-2">
        {orderStatus.map((status) => (
          <button
            key={status.id}
            className={`mr-2 text-md px-3 py-1 font-medium rounded-full border border-emerald-400 text-emerald-700 
            hover:bg-emerald-200 hover:cursor-pointer hover:scale-101 active:scale-98 transition-all duration-200 
            ${selectedStatus === status.index ? 'bg-primary font-semibold text-white' : ''}`}
            onClick={() => setSelectedStatus(status.index)}
          >
            {status.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-semibold text-green-900 ml-4">Đang tải đơn hàng...</p>
        </div>
      ) : (
        <div className="">
          {/* ORDERs LIST */}
          <div className="orderList p-2">
            {orders.length > 0 &&
              orders.map((order) => {
                const Icon = OrderStatusIcon[order.orderStatusName as keyof typeof OrderStatusIcon]

                return (
                  <div
                    key={order.orderId}
                    className="orderItem p-2 border-b  border-emerald-300 bg-emerald-50 rounded-2xl mb-2"
                  >
                    {/* ORDER HEADER */}
                    <div className="orderInfo py-2 flex items-center justify-between px-3">
                      <div className="">
                        <p className="orderId text-md mb-1 font-semibold">
                          Mã đơn hàng: <span className="text-green-900">{order.orderId}</span>
                        </p>
                        <p className="orderDate text-sm">
                          <span className="text-gray-400">{formatted(order.orderedAt)}</span>
                        </p>
                      </div>

                      {/* ORDER STATUS */}
                      <div className="orderStatus">
                        <span
                          className={
                            OrderStatusColor[
                              order.orderStatusName as keyof typeof OrderStatusColor
                            ] +
                            ' border px-2 py-1 rounded-xl text-xs font-semibold flex items-center'
                          }
                        >
                          <Icon className="inline-block w-4 h-4 mr-1" />
                          {OrderStatusName[order.orderStatusName as keyof typeof OrderStatusName]}
                        </span>
                      </div>
                    </div>
                    {/* ORDER ITEMS */}
                    <div className="orderItems pb-2 px-3">
                      {order.items[0] && (
                        <div className="flex items-center gap-2 justify-between">
                          <h2 className="text-sm text-gray-700 font-semibold">
                            {order.items[0].productName}
                          </h2>
                          <p className="text-sm text-gray-800 font-medium">
                            {order.items[0].quantity} x{' '}
                            {order.items[0].purchasedPrice.toLocaleString('vi-VN')}₫
                          </p>
                        </div>
                      )}
                      <div className="p text-xs font-semibold text-gray-500 mt-1 hover:underline hover:cursor-pointer">
                        + {order.items.length - 1} sản phẩm khác
                      </div>{' '}
                    </div>
                    {/* ORDER DETAILs */}
                    <div className="orderDetail px-2 flex items-center gap-3">
                      <button
                        className="flex items-center bg-primary hover:cursor-pointer text-xs
                   text-white font-bold hover:scale-101 active:scale-98 py-2 px-4 rounded-2xl"
                      >
                        Xem chi tiết
                        <ArrowRight className="inline-block w-4 h-4 ml-1" />
                      </button>

                      <button
                        className="border text-xs flex items-center hover:cursor-pointer 
                  border-emerald-500 rounded-2xl px-4 py-2 bg-white text-emerald-500 font-semibold hover:scale-101 active:scale-98"
                      >
                        <Download className="inline-block w-4 h-4 mr-1" />
                        Xem hóa đơn
                      </button>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      )}
    </div>
  )
}
