import { useEffect, useMemo, useState } from 'react'
import { useCustomer } from '../../context/useCustomer'
import type { OrderResponse } from '../../model/checkout.model'
import { OrderStatusColor, OrderStatusIcon, OrderStatusName } from '../../enum/OrderStatus.enum'
import { ArrowRight, Download, PackageSearch, ChevronLeft, ChevronRight } from 'lucide-react'
import OrderDetail from './OrderDetail'
import InvoiceModal from '../profile/InvoiceOrder'
import RefundSlip from './RefundSlip'

const PAGE_SIZE = 3

export default function MyOrder() {
  const { token } = useCustomer()

  const [loading, setLoading] = useState<boolean>(false)
  const [orders, setOrders] = useState<OrderResponse[]>([])
  const [selectedStatus, setSelectedStatus] = useState<number>(-1)
  const [currentPage, setCurrentPage] = useState<number>(1)

  // RECEIPT
  const [onCloseReceipt, setOnCloseReceipt] = useState<boolean>(true)

  const [onClose, setOnClose] = useState<boolean>(false)
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null)

  // REFUND
  const [isOpenRefund, setIsOpenRefund] = useState<boolean>(false)

  const orderStatus = [
    { index: -1, id: 'ALL', name: 'Tất cả' },
    { index: 7, id: 'PENDING', name: 'Đang chờ xử lý' },
    { index: 9, id: 'SHIPPING', name: 'Đang giao hàng' },
    { index: 8, id: 'CONFIRMED', name: 'Đã xác nhận' },
    { index: 10, id: 'COMPLETED', name: 'Đã hoàn thành' },
    { index: 11, id: 'CANCELLED', name: 'Đã hủy' },
  ]

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

  // FILTER theo trạng thái đơn hàng
  const resultFilter = useMemo(() => {
    if (selectedStatus === -1) return orders
    return orders.filter((order) => order.orderStatusId === selectedStatus)
  }, [orders, selectedStatus])

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(resultFilter.length / PAGE_SIZE)),
    [resultFilter]
  )

  const filteredOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE
    return resultFilter.slice(startIndex, startIndex + PAGE_SIZE)
  }, [resultFilter, currentPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedStatus])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [totalPages, currentPage])

  const showReceipt = (order: OrderResponse) => {
    setSelectedOrder(order)
    setOnCloseReceipt(true)
  }

  // SHOW DETAIL
  const handleShowDetail = (order: OrderResponse) => {
    setSelectedOrder(order)
    setOnCloseReceipt(false)
    setOnClose(true)
  }

  const handleShowRefund = (order: OrderResponse) => {
    setSelectedOrder(order)
    setIsOpenRefund(true)
    setOnClose(false)
  }

  return (
    <div className="myOrder text-left">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-2 mb-1">
        <h2 className="text-green-900 text-lg sm:text-xl font-bold">
          Quản lý đơn hàng cá nhân
          <span className="ml-2 text-sm text-emerald-500 font-medium">
            ({orders.length} đơn hàng)
          </span>
        </h2>
      </div>

      {/* ORDER STATUS FILTER */}
      <div className="orderStatusFilter flex flex-wrap gap-2 p-2">
        {orderStatus.map((status) => (
          <button
            key={status.id}
            onClick={() => setSelectedStatus(status.index)}
            className={`text-sm px-4 py-1.5 font-semibold rounded-full border transition-all duration-200
              hover:scale-102 active:scale-97 cursor-pointer
              ${
                selectedStatus === status.index
                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                  : 'border-emerald-300 text-emerald-700 bg-white hover:bg-emerald-50'
              }`}
          >
            {status.name}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-48 gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-green-800">Đang tải đơn hàng...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 px-4 text-center">
          <div className="bg-emerald-50 border border-emerald-100 rounded-full p-4">
            <PackageSearch className="w-8 h-8 text-emerald-500" />
          </div>
          <p className="text-green-900 font-semibold">Không có đơn hàng nào</p>
          <p className="text-sm text-gray-500">
            Hãy thử chọn trạng thái khác hoặc quay lại mua sắm nhé.
          </p>
        </div>
      ) : (
        <div className="orderList flex flex-col gap-3 p-2">
          {filteredOrders.map((order) => {
            const Icon = OrderStatusIcon[order.orderStatusName as keyof typeof OrderStatusIcon]
            const extraItemsCount = order.items.length - 1

            return (
              <div
                key={order.orderId}
                className="orderItem rounded-2xl border border-emerald-100 bg-white shadow-sm
                hover:shadow-md hover:border-emerald-200 transition-all duration-300 overflow-hidden"
              >
                {/* ORDER HEADER */}
                <div className="orderInfo flex items-center justify-between px-4 py-3 bg-emerald-50/60 border-b border-emerald-100">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">
                      Mã đơn hàng:{' '}
                      <span className="text-green-900 font-bold">#{order.orderId}</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatted(order.orderedAt)}</p>
                  </div>

                  <span
                    className={
                      OrderStatusColor[order.orderStatusName as keyof typeof OrderStatusColor] +
                      ' border px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 shrink-0'
                    }
                  >
                    <Icon className="w-4 h-4" />
                    {OrderStatusName[order.orderStatusName as keyof typeof OrderStatusName]}
                  </span>
                </div>

                {/* ORDER ITEMS */}
                <div className="orderItems px-4 py-3">
                  {order.items[0] && (
                    <div className="flex items-center gap-3 justify-between">
                      <h3 className="text-sm text-gray-700 font-semibold truncate">
                        {order.items[0].productName}
                      </h3>
                      <p className="text-sm text-gray-800 font-medium whitespace-nowrap shrink-0">
                        {order.items[0].quantity} ×{' '}
                        {order.items[0].purchasedPrice.toLocaleString('vi-VN')}₫
                      </p>
                    </div>
                  )}

                  {extraItemsCount > 0 && (
                    <p className="text-xs font-semibold text-emerald-600 mt-1.5 hover:underline cursor-pointer w-fit">
                      + {extraItemsCount} sản phẩm khác
                    </p>
                  )}
                </div>

                {/* ORDER ACTIONS */}
                <div className="orderDetail flex items-center gap-2 px-4 pb-4">
                  <button
                    onClick={() => handleShowDetail(order)}
                    className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 cursor-pointer text-xs
                    text-white font-bold hover:scale-102 active:scale-97 transition-all duration-200 py-2 px-4 rounded-xl"
                  >
                    Xem chi tiết
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => showReceipt(order)}
                    className="flex items-center gap-1 border border-emerald-400 text-xs cursor-pointer
                    rounded-xl px-4 py-2 bg-white text-emerald-600 font-semibold
                    hover:bg-emerald-50 hover:scale-102 active:scale-97 transition-all duration-200"
                  >
                    <Download className="w-4 h-4" />
                    Xem hóa đơn
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* PAGINATION */}
      {!loading && resultFilter.length > 0 && (
        <div className="flex flex-wrap justify-between items-center gap-2 mt-3 px-2">
          <p className="text-sm text-gray-500">
            Hiển thị {filteredOrders.length} / {resultFilter.length} đơn hàng
          </p>

          {totalPages > 1 && (
            <div className="pagination flex items-center gap-1.5">
              <button
                className="flex items-center justify-center w-8 h-8 rounded-full border border-emerald-300
                text-emerald-600 hover:bg-emerald-50 disabled:opacity-40 disabled:cursor-not-allowed
                disabled:hover:bg-transparent transition-all"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, index) => {
                const page = index + 1
                const isActive = currentPage === page

                return (
                  <button
                    key={page}
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-all
                      ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                          : 'border border-emerald-300 text-emerald-600 hover:bg-emerald-50'
                      }`}
                    onClick={() => setCurrentPage(page)}
                    disabled={isActive}
                  >
                    {page}
                  </button>
                )
              })}

              <button
                className="flex items-center justify-center w-8 h-8 rounded-full border border-emerald-300
                text-emerald-600 hover:bg-emerald-50 disabled:opacity-40 disabled:cursor-not-allowed
                disabled:hover:bg-transparent transition-all"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* MODAL SHOW DETAIL */}
      {selectedOrder && onClose && (
        <OrderDetail
          order={selectedOrder}
          setOnClose={setOnClose}
          setIsOpenRefund={setIsOpenRefund}
          handleShowRefund={handleShowRefund}
        />
      )}

      {/* MODAL SHOW RECEIPT */}
      {selectedOrder && onCloseReceipt && (
        <InvoiceModal order={selectedOrder} setOnClose={setOnCloseReceipt} />
      )}

      {/* MODAL REFUNDSLIP */}
      {isOpenRefund && selectedOrder && (
        <RefundSlip order={selectedOrder} setOnClose={setIsOpenRefund} />
      )}
    </div>
  )
}
