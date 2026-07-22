import { useCallback, useEffect, useRef, useState } from 'react'
import { Spin, message, DatePicker, Select } from 'antd'
import { type Dayjs } from 'dayjs'
import { TrendingUp, Package, ShoppingCart, Flame, Users, RefreshCw } from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'

import type {
  RevenueByPeriod,
  InventoryOverview,
  OrderStatusDistribution,
  TopProduct,
  NewCustomerStats,
  ReportType,
} from '../model/statistics.model'

import {
  getRevenueByPeriod,
  getInventoryOverview,
  getOrderStatusDistribution,
  getTopProducts,
  getNewCustomerStats,
} from '../services/statistics.service'

import ExportButtons from '../components/statistics/ExportButtons'

const { RangePicker } = DatePicker

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value)

const formatNumber = (value: number) => new Intl.NumberFormat('vi-VN').format(value)

const PIE_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

const TAB_LIST = [
  { key: 'revenue', label: 'Doanh thu', icon: <TrendingUp size={16} /> },
  { key: 'inventory', label: 'Hàng tồn', icon: <Package size={16} /> },
  { key: 'orders', label: 'Đơn hàng', icon: <ShoppingCart size={16} /> },
  { key: 'top-products', label: 'Bán chạy', icon: <Flame size={16} /> },
  { key: 'new-users', label: 'Người dùng mới', icon: <Users size={16} /> },
]

export default function StatisticPage() {
  const token = localStorage.getItem('token') ?? ''
  const abortRef = useRef<AbortController | null>(null)
  const [activeTab, setActiveTab] = useState<string>('revenue')
  const [loading, setLoading] = useState(false)

  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null])
  const [groupBy, setGroupBy] = useState<'day' | 'month'>('month')

  const startDate = dateRange[0]?.format('YYYY-MM-DD')
  const endDate = dateRange[1]?.format('YYYY-MM-DD')

  const [revenueData, setRevenueData] = useState<RevenueByPeriod[]>([])
  const [inventoryData, setInventoryData] = useState<InventoryOverview | null>(null)
  const [orderStatus, setOrderStatus] = useState<OrderStatusDistribution[]>([])
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [newUsers, setNewUsers] = useState<NewCustomerStats[]>([])

  const fetchTabData = useCallback(async () => {
    if (!token) return
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)
    try {
      switch (activeTab) {
        case 'revenue': {
          const data = await getRevenueByPeriod(token, startDate, endDate, groupBy)
          if (!controller.signal.aborted) setRevenueData(data)
          break
        }
        case 'inventory': {
          const data = await getInventoryOverview(token)
          if (!controller.signal.aborted) setInventoryData(data)
          break
        }
        case 'orders': {
          const data = await getOrderStatusDistribution(token, startDate, endDate)
          if (!controller.signal.aborted) setOrderStatus(data)
          break
        }
        case 'top-products': {
          const data = await getTopProducts(token, 10, startDate, endDate)
          if (!controller.signal.aborted) setTopProducts(data)
          break
        }
        case 'new-users': {
          const data = await getNewCustomerStats(token, startDate, endDate)
          if (!controller.signal.aborted) setNewUsers(data)
          break
        }
      }
    } catch {
      if (!controller.signal.aborted) {
        message.error('Không thể tải dữ liệu báo cáo.')
      }
    } finally {
      if (!controller.signal.aborted) setLoading(false)
    }
  }, [token, activeTab, startDate, endDate, groupBy])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTabData()
    return () => abortRef.current?.abort()
  }, [fetchTabData])

  return (
    <div className="min-h-screen bg-gray-50/50 p-3 sm:p-4 lg:p-6">
      <Spin spinning={loading} size="medium">
        {/* BANNER */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-5 sm:p-6 lg:p-8 mb-4 sm:mb-6">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMS41IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDgpIi8+PC9zdmc+')] opacity-40" />
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                <span className="text-emerald-100 text-xs font-medium uppercase tracking-wider">
                  Trung tâm báo cáo
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight">
                Thống kê và báo cáo
              </h3>
              <p className="text-white/70 text-sm sm:text-base mt-1.5">
                Phân tích doanh thu, hàng tồn, đơn hàng, sản phẩm và người dùng
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <ExportButtons
                activeTab={activeTab as ReportType}
                startDate={startDate}
                endDate={endDate}
              />
              <button
                onClick={fetchTabData}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 text-sm font-medium text-white hover:bg-white/25 hover:border-white/35 active:bg-white/30 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <RefreshCw size={15} />
              </button>
            </div>
          </div>
        </section>

        {/* DATE FILTER BAR */}
        <div className="flex flex-wrap items-center gap-3 mb-4 sm:mb-6 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
          <span className="text-sm font-medium text-gray-600">Bộ lọc thời gian:</span>
          <RangePicker
            value={dateRange}
            onChange={(dates) => setDateRange(dates as [Dayjs | null, Dayjs | null])}
            format="DD/MM/YYYY"
            placeholder={['Từ ngày', 'Đến ngày']}
            allowClear
            className="!w-[280px]"
          />
          {(activeTab === 'revenue' || activeTab === 'new-users') && (
            <Select
              value={groupBy}
              onChange={setGroupBy}
              options={[
                { value: 'day', label: 'Theo ngày' },
                { value: 'month', label: 'Theo tháng' },
              ]}
              className="!w-[130px]"
            />
          )}
          <button
            onClick={() => {
              setDateRange([null, null])
              setGroupBy('month')
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all cursor-pointer"
          >
            <RefreshCw size={13} />
            Xoá bộ lọc
          </button>
        </div>

        {/* TABS */}
        <div className="flex gap-1 mb-4 sm:mb-6 overflow-x-auto pb-1">
          {TAB_LIST.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.key
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB CONTENT */}
        {activeTab === 'revenue' && <RevenueTab data={revenueData} groupBy={groupBy} />}
        {activeTab === 'inventory' && <InventoryTab data={inventoryData} loading={loading} />}
        {activeTab === 'orders' && <OrdersTab data={orderStatus} />}
        {activeTab === 'top-products' && <TopProductsTab data={topProducts} loading={loading} />}
        {activeTab === 'new-users' && <NewUsersTab data={newUsers} groupBy={groupBy} />}
      </Spin>
    </div>
  )
}

// ==========================
// REVENUE TAB
// ==========================
function RevenueTab({ data, groupBy }: { data: RevenueByPeriod[]; groupBy: string }) {
  const totalRevenue = data.reduce((sum, r) => sum + r.revenue, 0)
  const totalOrders = data.reduce((sum, r) => sum + r.orderCount, 0)
  const avgPerOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <SummaryCard label="Tổng doanh thu" value={formatCurrency(totalRevenue)} color="emerald" />
        <SummaryCard label="Tổng đơn hàng" value={formatNumber(totalOrders)} color="blue" />
        <SummaryCard label="TB đơn hàng" value={formatCurrency(avgPerOrder)} color="amber" />
      </div>

      {/* Chart */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-base font-semibold text-gray-800 mb-3">
          Doanh thu {groupBy === 'day' ? 'theo ngày' : 'theo tháng'}
        </h3>
        {data.length > 0 ? (
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis
                  dataKey="period"
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
                  angle={-35}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) =>
                    v >= 1000000
                      ? `${(v / 1000000).toFixed(0)}tr`
                      : v >= 1000
                        ? `${(v / 1000).toFixed(0)}k`
                        : v
                  }
                />
                <Tooltip formatter={(value: any) => [formatCurrency(value), 'Doanh thu']} />
                <Bar dataKey="revenue" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyState />
        )}
      </div>

      {/* Table */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-base font-semibold text-gray-800 mb-3">Chi tiết doanh thu</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-3 py-2.5 text-left text-xs font-bold text-gray-500 uppercase">
                  STT
                </th>
                <th className="px-3 py-2.5 text-left text-xs font-bold text-gray-500 uppercase">
                  Thời gian
                </th>
                <th className="px-3 py-2.5 text-right text-xs font-bold text-gray-500 uppercase">
                  Doanh thu
                </th>
                <th className="px-3 py-2.5 text-center text-xs font-bold text-gray-500 uppercase">
                  Số đơn
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.map((r, i) => (
                <tr key={r.period} className="hover:bg-gray-50/50">
                  <td className="px-3 py-3 text-sm text-gray-500">{i + 1}</td>
                  <td className="px-3 py-3 text-sm font-medium text-gray-900">{r.period}</td>
                  <td className="px-3 py-3 text-sm text-right font-semibold text-emerald-700">
                    {formatCurrency(r.revenue)}
                  </td>
                  <td className="px-3 py-3 text-sm text-center">{formatNumber(r.orderCount)}</td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-gray-400">
                    Chưa có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ==========================
// INVENTORY TAB
// ==========================
function InventoryTab({ data, loading }: { data: InventoryOverview | null; loading: boolean }) {
  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      {data && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <SummaryCard
            label="Tổng sản phẩm"
            value={formatNumber(data.totalProducts)}
            color="blue"
          />
          <SummaryCard
            label="Tồn thấp (<20)"
            value={formatNumber(data.lowStockCount)}
            color="rose"
          />
          <SummaryCard
            label="Tồn trung bình (20-49)"
            value={formatNumber(data.mediumStockCount)}
            color="amber"
          />
          <SummaryCard
            label="Tồn cao (>=50)"
            value={formatNumber(data.highStockCount)}
            color="emerald"
          />
        </div>
      )}

      {/* Table */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-base font-semibold text-gray-800 mb-3">Chi tiết hàng tồn kho</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-3 py-2.5 text-left text-xs font-bold text-gray-500 uppercase">
                  STT
                </th>
                <th className="px-3 py-2.5 text-left text-xs font-bold text-gray-500 uppercase">
                  Sản phẩm
                </th>
                <th className="px-3 py-2.5 text-left text-xs font-bold text-gray-500 uppercase">
                  Danh mục
                </th>
                <th className="px-3 py-2.5 text-center text-xs font-bold text-gray-500 uppercase">
                  Tồn kho
                </th>
                <th className="px-3 py-2.5 text-right text-xs font-bold text-gray-500 uppercase">
                  Giá
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data?.details.map((d, i) => (
                <tr key={d.productId} className="hover:bg-gray-50/50">
                  <td className="px-3 py-3 text-sm text-gray-500">{i + 1}</td>
                  <td className="px-3 py-3 text-sm font-medium text-gray-900">{d.productName}</td>
                  <td className="px-3 py-3 text-sm text-gray-600">{d.categoryName}</td>
                  <td className="px-3 py-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                        d.inventory < 20
                          ? 'bg-rose-50 text-rose-700 ring-1 ring-rose-200/60'
                          : d.inventory < 50
                            ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-200/60'
                            : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60'
                      }`}
                    >
                      {formatNumber(d.inventory)}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-sm text-right font-semibold text-emerald-700">
                    {formatCurrency(d.price)}
                  </td>
                </tr>
              ))}
              {!data && !loading && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400">
                    Chưa có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ==========================
// ORDERS TAB
// ==========================
function OrdersTab({ data }: { data: OrderStatusDistribution[] }) {
  const totalOrders = data.reduce((sum, r) => sum + r.count, 0)

  const statusColorMap: Record<string, string> = {
    PENDING: 'amber',
    CONFIRMED: 'blue',
    SHIPPING: 'cyan',
    COMPLETED: 'emerald',
    CANCELLED: 'rose',
  }

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <SummaryCard label="Tổng đơn" value={formatNumber(totalOrders)} color="blue" />
        {data.map((s) => (
          <SummaryCard
            key={s.statusName}
            label={s.statusName}
            value={formatNumber(s.count)}
            color={statusColorMap[s.statusName] ?? 'gray'}
          />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pie Chart */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-base font-semibold text-gray-800 mb-3">
            Phân bổ trạng thái đơn hàng
          </h3>
          {data.length > 0 ? (
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="count"
                    nameKey="statusName"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={({ statusName, percentage }: any) =>
                      `${statusName} (${percentage?.toFixed(1)}%)`
                    }
                  >
                    {data.map((_, index) => (
                      <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState />
          )}
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-base font-semibold text-gray-800 mb-3">Số lượng theo trạng thái</h3>
          {data.length > 0 ? (
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis
                    dataKey="statusName"
                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-base font-semibold text-gray-800 mb-3">Chi tiết trạng thái</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-3 py-2.5 text-left text-xs font-bold text-gray-500 uppercase">
                  Trạng thái
                </th>
                <th className="px-3 py-2.5 text-center text-xs font-bold text-gray-500 uppercase">
                  Số lượng
                </th>
                <th className="px-3 py-2.5 text-center text-xs font-bold text-gray-500 uppercase">
                  Tỷ lệ
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.map((r) => (
                <tr key={r.statusName} className="hover:bg-gray-50/50">
                  <td className="px-3 py-3 text-sm font-medium text-gray-900">{r.statusName}</td>
                  <td className="px-3 py-3 text-sm text-center">{formatNumber(r.count)}</td>
                  <td className="px-3 py-3 text-sm text-center">{r.percentage?.toFixed(1)}%</td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-12 text-center text-gray-400">
                    Chưa có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ==========================
// TOP PRODUCTS TAB
// ==========================
function TopProductsTab({ data, loading }: { data: TopProduct[]; loading: boolean }) {
  const chartData = data.slice(0, 5)

  return (
    <div className="space-y-4">
      {/* Bar Chart */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-base font-semibold text-gray-800 mb-3">Top 5 sản phẩm bán chạy</h3>
        {chartData.length > 0 ? (
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="productName"
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  axisLine={false}
                  tickLine={false}
                  width={140}
                />
                <Tooltip formatter={(value: any) => [formatNumber(value), 'Số lượng']} />
                <Bar dataKey="totalQuantity" fill="#10b981" radius={[0, 6, 6, 0]} maxBarSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyState />
        )}
      </div>

      {/* Table */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-base font-semibold text-gray-800 mb-3">Danh sach chi tiết</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-3 py-2.5 text-left text-xs font-bold text-gray-500 uppercase">
                  STT
                </th>
                <th className="px-3 py-2.5 text-left text-xs font-bold text-gray-500 uppercase">
                  Sản phẩm
                </th>
                <th className="px-3 py-2.5 text-left text-xs font-bold text-gray-500 uppercase">
                  Danh mục
                </th>
                <th className="px-3 py-2.5 text-center text-xs font-bold text-gray-500 uppercase">
                  SL bán
                </th>
                <th className="px-3 py-2.5 text-right text-xs font-bold text-gray-500 uppercase">
                  Doanh thu
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.map((p, i) => (
                <tr key={p.productId} className="hover:bg-gray-50/50">
                  <td className="px-3 py-3 text-sm text-gray-500">{i + 1}</td>
                  <td className="px-3 py-3 text-sm font-medium text-gray-900">{p.productName}</td>
                  <td className="px-3 py-3 text-sm text-gray-600">{p.categoryName}</td>
                  <td className="px-3 py-3 text-sm text-center font-semibold">
                    {formatNumber(p.totalQuantity)}
                  </td>
                  <td className="px-3 py-3 text-sm text-right font-semibold text-emerald-700">
                    {formatCurrency(p.totalRevenue)}
                  </td>
                </tr>
              ))}
              {data.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400">
                    Chưa có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ==========================
// NEW USERS TAB
// ==========================
function NewUsersTab({ data, groupBy }: { data: NewCustomerStats[]; groupBy: string }) {
  const totalNewUsers = data.reduce((sum, r) => sum + r.count, 0)

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-1 gap-3 sm:gap-4">
        <SummaryCard label="Tổng người dùng mới" value={formatNumber(totalNewUsers)} color="blue" />
      </div>

      {/* Chart */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-base font-semibold text-gray-800 mb-3">
          Người dùng mới {groupBy === 'day' ? 'theo ngày' : 'theo tháng'}
        </h3>
        {data.length > 0 ? (
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis
                  dataKey="period"
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
                  angle={-35}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(value: any) => [formatNumber(value), 'KH mới']} />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyState />
        )}
      </div>

      {/* Table */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-base font-semibold text-gray-800 mb-3">Chi tiết</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-3 py-2.5 text-left text-xs font-bold text-gray-500 uppercase">
                  {groupBy === 'day' ? 'Ngày' : 'Tháng'}
                </th>
                <th className="px-3 py-2.5 text-center text-xs font-bold text-gray-500 uppercase">
                  Số KH mới
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.map((r) => (
                <tr key={r.period} className="hover:bg-gray-50/50">
                  <td className="px-3 py-3 text-sm font-medium text-gray-900">{r.period}</td>
                  <td className="px-3 py-3 text-sm text-center font-semibold text-blue-700">
                    {formatNumber(r.count)}
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={2} className="py-12 text-center text-gray-400">
                    Chưa có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ==========================
// SHARED COMPONENTS
// ==========================
function SummaryCard({ label, value, color }: { label: string; value: string; color: string }) {
  const colorMap: Record<string, { bg: string; text: string; iconBg: string }> = {
    emerald: {
      bg: 'from-emerald-50 to-teal-50',
      text: 'text-emerald-700',
      iconBg: 'bg-emerald-100',
    },
    green: { bg: 'from-green-50 to-emerald-50', text: 'text-green-700', iconBg: 'bg-green-100' },
    blue: { bg: 'from-blue-50 to-cyan-50', text: 'text-blue-700', iconBg: 'bg-blue-100' },
    cyan: { bg: 'from-cyan-50 to-sky-50', text: 'text-cyan-700', iconBg: 'bg-cyan-100' },
    amber: { bg: 'from-amber-50 to-orange-50', text: 'text-amber-700', iconBg: 'bg-amber-100' },
    rose: { bg: 'from-rose-50 to-pink-50', text: 'text-rose-700', iconBg: 'bg-rose-100' },
    gray: { bg: 'from-gray-50 to-slate-50', text: 'text-gray-700', iconBg: 'bg-gray-100' },
  }
  const c = colorMap[color] ?? colorMap.gray

  return (
    <div className={`bg-gradient-to-r ${c.bg} p-4 rounded-2xl border border-gray-100/60`}>
      <div className={`text-xl font-bold ${c.text}`}>{value}</div>
      <div className="text-xs text-gray-500 mt-0.5">{label}</div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 p-6 min-h-[160px] flex items-center justify-center">
      <p className="text-gray-400 text-sm">Chưa có dữ liệu</p>
    </div>
  )
}
