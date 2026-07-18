import { useCallback, useEffect, useRef, useState } from 'react'
import { Spin, message } from 'antd'
import {
  BarChart3,
  ShoppingCart,
  Star,
  RotateCcw,
  Ticket,
  Leaf,
  Users,
  TrendingUp,
  Download,
} from 'lucide-react'
import {
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
  RevenueByCategory,
  TopProduct,
  OrderStatusDistribution,
  ReviewStats,
  RefundStats,
  VoucherStat,
  CarbonIndexStats,
  TopCustomer,
  ReportType,
} from '../model/statistics.model'

import {
  getRevenueByCategory,
  getTopProducts,
  getOrderStatusDistribution,
  getReviewStats,
  getRefundStats,
  getVoucherStats,
  getCarbonIndexStats,
  getTopCustomers,
} from '../services/statistics.service'

import ExportButtons from '../components/statistics/ExportButtons'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value)

const formatNumber = (value: number) => new Intl.NumberFormat('vi-VN').format(value)

const PIE_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

const TAB_LIST = [
  { key: 'overview', label: 'Tổng quan', icon: <BarChart3 size={16} /> },
  { key: 'revenue', label: 'Doanh thu', icon: <TrendingUp size={16} /> },
  { key: 'products', label: 'Sản phẩm', icon: <ShoppingCart size={16} /> },
  { key: 'customers', label: 'Khách hàng', icon: <Users size={16} /> },
  { key: 'reviews', label: 'Đánh giá và Hoàn tiền', icon: <Star size={16} /> },
  { key: 'vouchers', label: 'Voucher', icon: <Ticket size={16} /> },
]

export default function StatisticPage() {
  const token = localStorage.getItem('token') ?? ''
  const abortRef = useRef<AbortController | null>(null)
  const [activeTab, setActiveTab] = useState<string>('overview')
  const [loading, setLoading] = useState(false)

  const [revenueData, setRevenueData] = useState<RevenueByCategory[]>([])
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [orderStatus, setOrderStatus] = useState<OrderStatusDistribution[]>([])
  const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null)
  const [refundStats, setRefundStats] = useState<RefundStats | null>(null)
  const [voucherStats, setVoucherStats] = useState<VoucherStat[]>([])
  const [carbonStats, setCarbonStats] = useState<CarbonIndexStats | null>(null)
  const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([])

  const fetchTabData = useCallback(async () => {
    if (!token) return
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)
    try {
      switch (activeTab) {
        case 'overview': {
          const [rev, status, review, refund, carbon] = await Promise.all([
            getRevenueByCategory(token),
            getOrderStatusDistribution(token),
            getReviewStats(token),
            getRefundStats(token),
            getCarbonIndexStats(token),
          ])
          if (!controller.signal.aborted) {
            setRevenueData(rev)
            setOrderStatus(status)
            setReviewStats(review)
            setRefundStats(refund)
            setCarbonStats(carbon)
          }
          break
        }
        case 'revenue': {
          const revData = await getRevenueByCategory(token)
          if (!controller.signal.aborted) setRevenueData(revData)
          break
        }
        case 'products': {
          const [products, carbonData] = await Promise.all([
            getTopProducts(token, 10),
            getCarbonIndexStats(token),
          ])
          if (!controller.signal.aborted) {
            setTopProducts(products)
            setCarbonStats(carbonData)
          }
          break
        }
        case 'customers': {
          const customers = await getTopCustomers(token, 10)
          if (!controller.signal.aborted) setTopCustomers(customers)
          break
        }
        case 'reviews': {
          const [reviewData, refundData] = await Promise.all([
            getReviewStats(token),
            getRefundStats(token),
          ])
          if (!controller.signal.aborted) {
            setReviewStats(reviewData)
            setRefundStats(refundData)
          }
          break
        }
        case 'vouchers': {
          const vouchers = await getVoucherStats(token)
          if (!controller.signal.aborted) setVoucherStats(vouchers)
          break
        }
      }
    } catch {
      if (!controller.signal.aborted) {
        message.error('Khong the tai du lieu bao cao.')
      }
    } finally {
      if (!controller.signal.aborted) setLoading(false)
    }
  }, [token, activeTab])

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
                  Trung tâm báo cáo đa loại
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight">
                Thống kê và báo cáo
              </h3>
              <p className="text-white/70 text-sm sm:text-base mt-1.5">
                Phân tích doanh thu, sản phẩm, khách hàng và hoạt động kinh doanh
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <ExportButtons activeTab={activeTab as ReportType} />
              <button
                onClick={fetchTabData}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 text-sm font-medium text-white hover:bg-white/25 hover:border-white/35 active:bg-white/30 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Download size={15} />
              </button>
            </div>
          </div>
        </section>

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
        {activeTab === 'overview' && (
          <OverviewTab
            revenueData={revenueData}
            orderStatus={orderStatus}
            reviewStats={reviewStats}
            refundStats={refundStats}
          />
        )}
        {activeTab === 'revenue' && <RevenueTab revenueData={revenueData} />}
        {activeTab === 'products' && (
          <ProductsTab topProducts={topProducts} carbonStats={carbonStats} loading={loading} />
        )}
        {activeTab === 'customers' && (
          <CustomersTab topCustomers={topCustomers} loading={loading} />
        )}
        {activeTab === 'reviews' && (
          <ReviewsTab reviewStats={reviewStats} refundStats={refundStats} />
        )}
        {activeTab === 'vouchers' && <VouchersTab voucherStats={voucherStats} loading={loading} />}
      </Spin>
    </div>
  )
}

// ==========================
// OVERVIEW TAB
// ==========================
function OverviewTab({
  revenueData,
  orderStatus,
  reviewStats,
  refundStats,
}: {
  revenueData: RevenueByCategory[]
  orderStatus: OrderStatusDistribution[]
  reviewStats: ReviewStats | null
  refundStats: RefundStats | null
}) {
  const totalRevenue = revenueData.reduce((sum, r) => sum + r.revenue, 0)
  const totalOrders = orderStatus.reduce((sum, r) => sum + r.count, 0)

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <SummaryCard
          label="Tổng doanh thu"
          value={formatCurrency(totalRevenue)}
          icon={<TrendingUp size={20} />}
          color="emerald"
        />
        <SummaryCard
          label="Tổng đơn hang"
          value={formatNumber(totalOrders)}
          icon={<ShoppingCart size={20} />}
          color="blue"
        />
        <SummaryCard
          label="Đánh giá TB"
          value={reviewStats ? `${reviewStats.averageRating.toFixed(1)} / 5` : '0 / 5'}
          icon={<Star size={20} />}
          color="amber"
        />
        <SummaryCard
          label="Ty le hoan tien"
          value={refundStats ? `${refundStats.refundRate.toFixed(1)}%` : '0%'}
          icon={<RotateCcw size={20} />}
          color="rose"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue by Category Pie */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-base font-semibold text-gray-800 mb-3">Doanh thu theo danh muc</h3>
          {revenueData.length > 0 ? (
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueData}
                    dataKey="revenue"
                    nameKey="categoryName"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={({ categoryName, percentage }) =>
                      `${categoryName} (${percentage?.toFixed(1)}%)`
                    }
                  >
                    {revenueData.map((_, index) => (
                      <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState />
          )}
        </div>

        {/* Order Status Pie */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-base font-semibold text-gray-800 mb-3">
            Phân bố trạng thái đơn hàng
          </h3>
          {orderStatus.length > 0 ? (
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatus}
                    dataKey="count"
                    nameKey="statusName"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={({statusName, percentage}) =>
                      `${statusName} (${percentage?.toFixed(1)}%)`
                    }
                  >
                    {orderStatus.map((_, index) => (
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
      </div>
    </div>
  )
}

// ==========================
// REVENUE TAB
// ==========================
function RevenueTab({ revenueData }: { revenueData: RevenueByCategory[] }) {
  return (
    <div className="space-y-4">
      {/* Bar Chart */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-base font-semibold text-gray-800 mb-3">Doanh thu theo danh muc</h3>
        {revenueData.length > 0 ? (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis
                  dataKey="categoryName"
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
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
                <Tooltip formatter={(value: number) => [formatCurrency(value), 'Doanh thu']} />
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
        <h3 className="text-base font-semibold text-gray-800 mb-3">Chi tiet doanh thu</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-3 py-2.5 text-left text-xs font-bold text-gray-500 uppercase">
                  STT
                </th>
                <th className="px-3 py-2.5 text-left text-xs font-bold text-gray-500 uppercase">
                  Danh muc
                </th>
                <th className="px-3 py-2.5 text-right text-xs font-bold text-gray-500 uppercase">
                  Doanh thu
                </th>
                <th className="px-3 py-2.5 text-center text-xs font-bold text-gray-500 uppercase">
                  So don
                </th>
                <th className="px-3 py-2.5 text-center text-xs font-bold text-gray-500 uppercase">
                  Ty le
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {revenueData.map((r, i) => (
                <tr key={r.categoryId} className="hover:bg-gray-50/50">
                  <td className="px-3 py-3 text-sm text-gray-500">{i + 1}</td>
                  <td className="px-3 py-3 text-sm font-medium text-gray-900">{r.categoryName}</td>
                  <td className="px-3 py-3 text-sm text-right font-semibold text-emerald-700">
                    {formatCurrency(r.revenue)}
                  </td>
                  <td className="px-3 py-3 text-sm text-center">{formatNumber(r.orderCount)}</td>
                  <td className="px-3 py-3 text-sm text-center">{r.percentage?.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ==========================
// PRODUCTS TAB
// ==========================
function ProductsTab({
  topProducts,
  carbonStats,
  loading,
}: {
  topProducts: TopProduct[]
  carbonStats: CarbonIndexStats | null
  loading: boolean
}) {
  return (
    <div className="space-y-4">
      {/* Carbon Stats */}
      {carbonStats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <SummaryCard
            label="Carbon TB"
            value={carbonStats.averageCarbonIndex.toFixed(1)}
            icon={<Leaf size={20} />}
            color="emerald"
          />
          <SummaryCard
            label="Thap (<5.0)"
            value={formatNumber(carbonStats.lowCarbonCount)}
            icon={<Leaf size={20} />}
            color="green"
          />
          <SummaryCard
            label="Trung binh"
            value={formatNumber(carbonStats.mediumCarbonCount)}
            icon={<Leaf size={20} />}
            color="amber"
          />
          <SummaryCard
            label="Cao (>=15.0)"
            value={formatNumber(carbonStats.highCarbonCount)}
            icon={<Leaf size={20} />}
            color="rose"
          />
        </div>
      )}

      {/* Top Products Table */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-base font-semibold text-gray-800 mb-3">Top san pham ban chay</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-3 py-2.5 text-left text-xs font-bold text-gray-500 uppercase">
                  STT
                </th>
                <th className="px-3 py-2.5 text-left text-xs font-bold text-gray-500 uppercase">
                  San pham
                </th>
                <th className="px-3 py-2.5 text-left text-xs font-bold text-gray-500 uppercase">
                  Danh muc
                </th>
                <th className="px-3 py-2.5 text-center text-xs font-bold text-gray-500 uppercase">
                  SL ban
                </th>
                <th className="px-3 py-2.5 text-right text-xs font-bold text-gray-500 uppercase">
                  Doanh thu
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {topProducts.map((p, i) => (
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
              {topProducts.length === 0 && !loading && (
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
// CUSTOMERS TAB
// ==========================
function CustomersTab({
  topCustomers,
  loading,
}: {
  topCustomers: TopCustomer[]
  loading: boolean
}) {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm">
      <h3 className="text-base font-semibold text-gray-800 mb-3">
        Top khách hàng chi tiêu nhiều nhất
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-3 py-2.5 text-left text-xs font-bold text-gray-500 uppercase">
                STT
              </th>
              <th className="px-3 py-2.5 text-left text-xs font-bold text-gray-500 uppercase">
                Khách hàng
              </th>
              <th className="px-3 py-2.5 text-center text-xs font-bold text-gray-500 uppercase">
                Số đơn
              </th>
              <th className="px-3 py-2.5 text-right text-xs font-bold text-gray-500 uppercase">
                Tổng chi tiêu
              </th>
              <th className="px-3 py-2.5 text-right text-xs font-bold text-gray-500 uppercase">
                TB/đơn
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {topCustomers.map((c, i) => (
              <tr key={c.customerId} className="hover:bg-gray-50/50">
                <td className="px-3 py-3 text-sm text-gray-500">{i + 1}</td>
                <td className="px-3 py-3 text-sm font-medium text-gray-900">{c.username}</td>
                <td className="px-3 py-3 text-sm text-center">{formatNumber(c.totalOrders)}</td>
                <td className="px-3 py-3 text-sm text-right font-semibold text-emerald-700">
                  {formatCurrency(c.totalSpent)}
                </td>
                <td className="px-3 py-3 text-sm text-right text-gray-600">
                  {formatCurrency(c.averageOrderValue)}
                </td>
              </tr>
            ))}
            {topCustomers.length === 0 && !loading && (
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
  )
}

// ==========================
// REVIEWS TAB
// ==========================
function ReviewsTab({
  reviewStats,
  refundStats,
}: {
  reviewStats: ReviewStats | null
  refundStats: RefundStats | null
}) {
  const ratingData = reviewStats
    ? [
        { name: '1 sao', count: reviewStats.rating1Count },
        { name: '2 sao', count: reviewStats.rating2Count },
        { name: '3 sao', count: reviewStats.rating3Count },
        { name: '4 sao', count: reviewStats.rating4Count },
        { name: '5 sao', count: reviewStats.rating5Count },
      ]
    : []

  return (
    <div className="space-y-4">
      {/* Review Stats */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-base font-semibold text-gray-800 mb-3">Thong ke danh gia</h3>
        {reviewStats ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold text-amber-500">
                {reviewStats.averageRating.toFixed(1)}
              </div>
              <div>
                <div className="text-sm text-gray-500">Danh gia trung binh</div>
                <div className="text-sm text-gray-400">
                  {formatNumber(reviewStats.totalReviews)} danh gia
                </div>
              </div>
            </div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ratingData} layout="vertical" margin={{ left: 20, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    axisLine={false}
                    tickLine={false}
                    width={50}
                  />
                  <Tooltip />
                  <Bar dataKey="count" fill="#f59e0b" radius={[0, 6, 6, 0]} maxBarSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <EmptyState />
        )}
      </div>

      {/* Refund Stats */}
      {refundStats && (
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-base font-semibold text-gray-800 mb-3">Thong ke hoan tien</h3>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            <SummaryCard
              label="Tổng hoàn tien"
              value={formatNumber(refundStats.totalRefunds)}
              icon={<RotateCcw size={18} />}
              color="gray"
            />
            <SummaryCard
              label="PENDING"
              value={formatNumber(refundStats.pendingCount)}
              icon={<RotateCcw size={18} />}
              color="amber"
            />
            <SummaryCard
              label="APPROVED"
              value={formatNumber(refundStats.approvedCount)}
              icon={<RotateCcw size={18} />}
              color="green"
            />
            <SummaryCard
              label="REJECTED"
              value={formatNumber(refundStats.rejectedCount)}
              icon={<RotateCcw size={18} />}
              color="rose"
            />
            <SummaryCard
              label="REFUNDED"
              value={formatNumber(refundStats.refundedCount)}
              icon={<RotateCcw size={18} />}
              color="blue"
            />
          </div>
        </div>
      )}
    </div>
  )
}

// ==========================
// VOUCHERS TAB
// ==========================
function VouchersTab({ voucherStats, loading }: { voucherStats: VoucherStat[]; loading: boolean }) {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm">
      <h3 className="text-base font-semibold text-gray-800 mb-3">Thong ke voucher</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-3 py-2.5 text-left text-xs font-bold text-gray-500 uppercase">
                Ma voucher
              </th>
              <th className="px-3 py-2.5 text-right text-xs font-bold text-gray-500 uppercase">
                Giam gia
              </th>
              <th className="px-3 py-2.5 text-center text-xs font-bold text-gray-500 uppercase">
                Luot su dung
              </th>
              <th className="px-3 py-2.5 text-right text-xs font-bold text-gray-500 uppercase">
                Tong giam
              </th>
              <th className="px-3 py-2.5 text-center text-xs font-bold text-gray-500 uppercase">
                Trang thai
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {voucherStats.map((v) => (
              <tr key={v.voucherId} className="hover:bg-gray-50/50">
                <td className="px-3 py-3 text-sm font-mono font-semibold text-emerald-700">
                  {v.code}
                </td>
                <td className="px-3 py-3 text-sm text-right">{formatCurrency(v.discountValue)}</td>
                <td className="px-3 py-3 text-sm text-center">{formatNumber(v.usageCount)}</td>
                <td className="px-3 py-3 text-sm text-right font-semibold">
                  {formatCurrency(v.totalDiscountGiven)}
                </td>
                <td className="px-3 py-3 text-center">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      v.isActive
                        ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60'
                        : 'bg-gray-50 text-gray-500 ring-1 ring-gray-200/60'
                    }`}
                  >
                    {v.isActive ? 'Hoạt động' : 'Không HD'}
                  </span>
                </td>
              </tr>
            ))}
            {voucherStats.length === 0 && !loading && (
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
  )
}

// ==========================
// SHARED COMPONENTS
// ==========================
function SummaryCard({
  label,
  value,
  icon,
  color,
}: {
  label: string
  value: string
  icon: React.ReactNode
  color: string
}) {
  const colorMap: Record<string, { bg: string; text: string; iconBg: string }> = {
    emerald: {
      bg: 'from-emerald-50 to-teal-50',
      text: 'text-emerald-700',
      iconBg: 'bg-emerald-100',
    },
    green: { bg: 'from-green-50 to-emerald-50', text: 'text-green-700', iconBg: 'bg-green-100' },
    blue: { bg: 'from-blue-50 to-cyan-50', text: 'text-blue-700', iconBg: 'bg-blue-100' },
    amber: { bg: 'from-amber-50 to-orange-50', text: 'text-amber-700', iconBg: 'bg-amber-100' },
    rose: { bg: 'from-rose-50 to-pink-50', text: 'text-rose-700', iconBg: 'bg-rose-100' },
    gray: { bg: 'from-gray-50 to-slate-50', text: 'text-gray-700', iconBg: 'bg-gray-100' },
  }
  const c = colorMap[color] ?? colorMap.gray

  return (
    <div className={`bg-gradient-to-r ${c.bg} p-4 rounded-2xl border border-gray-100/60`}>
      <div className="flex items-center gap-2.5 mb-2">
        <div className={`w-8 h-8 rounded-lg ${c.iconBg} flex items-center justify-center`}>
          <span className={c.text}>{icon}</span>
        </div>
      </div>
      <div className={`text-xl font-bold ${c.text}`}>{value}</div>
      <div className="text-xs text-gray-500 mt-0.5">{label}</div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 p-6 min-h-[160px] flex items-center justify-center">
      <p className="text-gray-400 text-sm">Chua co du lieu</p>
    </div>
  )
}
