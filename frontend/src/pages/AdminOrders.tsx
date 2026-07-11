import { CircleCheckBig, Eye, Search, SquarePenIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { orderResponse, orderStatusResponse } from '../model/order.model'
import { PaymentMethodId } from '../enum/PaymentMethod.enum'

export default function AdminOrders() {
  const [orderStatuses, setOrderStatuses] = useState<orderStatusResponse[]>([])

  // DANH SACH ORDER
  const [orders, setOrders] = useState<orderResponse[]>([])

  // TRANG THAI DON HANG DUOC CHON
  const [selectedStatus, setSelectedStatus] = useState<number | null>(null)

  // DU LIEU SEARCH
  const [searchQuery, setSearchQuery] = useState<string>('')

  // PAGE CURRENT
  const [currentPage, setCurrentPage] = useState<number>(1)

  // TOKEN DE XAC THUC NGUOI DUNG
  const token = localStorage.getItem('token')?? ""

  const vietnameseDateFormatter = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN')
  }

  useEffect(() => {
    // FETCH DANH SACH TRANG THAI DON HANG TU API
    const fetchOrderStatuses = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/admin/order-statuses', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })

        if (response.ok) {
          setOrderStatuses(await response.json())
        }
      } catch (error) {
        console.error('Error fetching order statuses:', error)
      }
    }

    // FETCH DANH SACH DON HANG TU API
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/admin/orders', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })

        if (response.ok) {
          setOrders(await response.json())
        }
      } catch (error) {
        console.error('Error fetching orders:', error)
      }
    }

    if (token) {
      fetchOrderStatuses()
      fetchOrders()
    }
  }, [token])

  return (
    <div className="flex flex-col gap-4 px-4">
      <header className="order-header p-4 rounded-2xl shadow bg-white ">
        <h1 className="text-xl text-green-900 font-semibold mb-4">Quản lý đơn hàng</h1>
        <div className="grid grid-cols-3 items-center gap-4">
          {/* SEARCH BAR */}
          <div className="search_group relative flex items-center gap-2 w-full col-span-2">
            <Search className="search_icon absolute left-3" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm đơn hàng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-3 pr-3 bg-gray-100 rounded-2xl  focus:outline-none focus:ring-1 focus:ring-emerald-200 w-full"
            />
          </div>

          {/* FILTERS */}
          <div className="filters_group flex items-center gap-4">
            <label htmlFor="orderStatus" className="text-green-900 text-md font-semibold">
              Trạng thái đơn hàng:
            </label>
            <select
              id="orderStatus"
              value={selectedStatus !== null ? selectedStatus : ''}
              onChange={(e) => setSelectedStatus(e.target.value ? Number(e.target.value) : null)}
              className="filter_select p-3 rounded-2xl bg-gray-100 focus:outline-none focus:ring-1 focus:ring-emerald-200"
            >
              <option value="">Tất cả trạng thái</option>
              {orderStatuses.map((status) => {
                return (
                  <option key={status.orderStatusId} value={status.orderStatusId}>
                    {status.orderStatusName}
                  </option>
                )
              })}
            </select>
          </div>
        </div>
      </header>

      {/* ORDER LIST */}
      <main className="order-main bg-white p-4 rounded-2xl shadow">
        <section className="order-list">
          <table className="w-full border border-gray-200 rounded-2xl">
            <thead className="bg-emerald-50/80">
              <tr>
                <th className="p-3 border-b border-gray-200 text-left">Mã khách hàng</th>
                <th className="p-3 border-b border-gray-200 text-left">Tên khách hàng</th>
                <th className="p-3 border-b border-gray-200 text-left">Giá trị</th>
                <th className="p-3 border-b border-gray-200 text-left">Phương thức thanh toán</th>
                <th className="p-3 border-b border-gray-200 text-left">Trạng thái</th>
                <th className="p-3 border-b border-gray-200 text-left">Ngày đặt hàng</th>
                <th className="p-3 border-b border-gray-200 text-left">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.orderId} className="hover:bg-gray-100">
                  <td className="p-3 border-b border-gray-200">{order.customerId}</td>
                  <td className="p-3 border-b border-gray-200">{order.orderReceiver}</td>
                  <td className="p-3 border-b border-gray-200">
                    {Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(order.totalAmount)}
                  </td>
                  <td className="p-3 border-b border-gray-200">
                    {PaymentMethodId[order.paymentMethodId as keyof typeof PaymentMethodId]}
                  </td>
                  <td className="p-3 border-b border-gray-200">{order.orderStatusName}</td>
                  <td className="p-3 border-b border-gray-200">
                    {vietnameseDateFormatter(order.orderedAt)}
                  </td>
                  <td className="p-3 border-b border-gray-200 text-lg font-bold flex items-center gap-2">
                    <Eye className="hover:cursor-pointer text-amber-500" size={20} />
                    <SquarePenIcon className="hover:cursor-pointer text-blue-600" size={20} />
                    <CircleCheckBig className="hover:cursor-pointer text-green-500" size={20} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* PAGINATION */}
        <section className="order-pagination mt-4 flex items-center justify-center gap-2">
          <button
            className="pagination-btn p-2 rounded-xl bg-gray-100 hover:bg-gray-200"
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Trước
          </button>
          <button
            onClick={() => setCurrentPage(1)}
            className={`pagination-btn p-2 rounded-xl  ${currentPage === 1 ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            1
          </button>
          <button
            onClick={() => setCurrentPage(2)}
            className={`pagination-btn p-2 rounded-xl  ${currentPage === 2 ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            2
          </button>
          <button
            onClick={() => setCurrentPage(3)}
            className={`pagination-btn p-2 rounded-xl  ${currentPage === 3 ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            3
          </button>
          <button
            className="pagination-btn p-2 rounded-xl bg-gray-100 hover:bg-gray-200"
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Sau
          </button>
        </section>
      </main>
    </div>
  )
}
