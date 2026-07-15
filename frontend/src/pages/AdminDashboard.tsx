import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Spin, message } from 'antd';
import {
  BanknoteCheck,
  Boxes,
  Sprout,
  WalletCards,
  TrendingUp,
  TrendingDown,
  Package,
  RefreshCw,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import type { DashboardSummary, RevenueByMonth, RecentOrder } from '../model/dashboard.model';

import {
  getDashboardSummary,
  getRevenueByMonth,
  getRecentOrders,
} from '../services/dashboard.service';

// ==========================
// HELPERS
// ==========================

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);

const formatNumber = (value: number) =>
  new Intl.NumberFormat('vi-VN').format(value);

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('vi-VN');

const MONTH_LABELS = [
  'T1', 'T2', 'T3', 'T4', 'T5', 'T6',
  'T7', 'T8', 'T9', 'T10', 'T11', 'T12',
];

const statusBadge = (name: string) => {
  const map: Record<string, string> = {
    PENDING: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200/60',
    CONFIRMED: 'bg-sky-50 text-sky-700 ring-1 ring-sky-200/60',
    SHIPPING: 'bg-violet-50 text-violet-700 ring-1 ring-violet-200/60',
    COMPLETED: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60',
    CANCELLED: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200/60',
  };
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${
        map[name] ?? 'bg-gray-50 text-gray-600 ring-1 ring-gray-200/60'
      }`}
    >
      {name}
    </span>
  );
};

const paymentBadge = (name: string) => {
  const map: Record<string, string> = {
    PAID: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60',
    UNPAID: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200/60',
    FAILED: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200/60',
  };
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${
        map[name] ?? 'bg-gray-50 text-gray-600 ring-1 ring-gray-200/60'
      }`}
    >
      {name}
    </span>
  );
};

// ==========================
// COLOR MAP
// ==========================

const colorMap = {
  gray: {
    text: 'text-slate-700',
    value: 'text-slate-800',
    icon: 'text-slate-600',
    iconBg: 'bg-slate-100',
    ring: 'ring-slate-200',
  },
  green: {
    text: 'text-emerald-700',
    value: 'text-emerald-700',
    icon: 'text-emerald-600',
    iconBg: 'bg-emerald-50',
    ring: 'ring-emerald-200',
  },
  amber: {
    text: 'text-amber-700',
    value: 'text-amber-700',
    icon: 'text-amber-600',
    iconBg: 'bg-amber-50',
    ring: 'ring-amber-200',
  },
  blue: {
    text: 'text-blue-700',
    value: 'text-blue-700',
    icon: 'text-blue-600',
    iconBg: 'bg-blue-50',
    ring: 'ring-blue-200',
  },
} as const;

type ColorKey = keyof typeof colorMap;

// ==========================
// COMPONENT
// ==========================

export default function AdminDashboard() {
  const token = localStorage.getItem('token') ?? '';
  const abortRef = useRef<AbortController | null>(null);

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [revenue, setRevenue] = useState<RevenueByMonth[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartYear] = useState(new Date().getFullYear());

  const fetchDashboard = useCallback(async () => {
    if (!token) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    try {
      const [summaryData, revenueData, ordersData] = await Promise.all([
        getDashboardSummary(token),
        getRevenueByMonth(token, chartYear),
        getRecentOrders(token, 8),
      ]);
      if (!controller.signal.aborted) {
        setSummary(summaryData);
        setRevenue(revenueData);
        setRecentOrders(ordersData);
      }
    } catch (_e: unknown) {
      if (!controller.signal.aborted) {
        message.error('Không thể tải dữ liệu dashboard.');
      }
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [token, chartYear]);

  useEffect(() => {
    fetchDashboard();
    return () => abortRef.current?.abort();
  }, [fetchDashboard]);

  const chartData = useMemo(
    () =>
      revenue.map((r) => ({
        name: MONTH_LABELS[r.month - 1],
        revenue: r.revenue,
      })),
    [revenue],
  );

  const summaryCards = useMemo(() => {
    if (!summary) return [];
    return [
      {
        label: 'Doanh số',
        value: summary.totalRevenue,
        unit: 'đ',
        icon: <BanknoteCheck size={22} />,
        color: 'gray' as ColorKey,
      },
      {
        label: 'Số lượng đơn hàng',
        value: summary.totalOrders,
        unit: 'đơn',
        icon: <WalletCards size={22} />,
        color: 'green' as ColorKey,
      },
      {
        label: 'Đơn đã thanh toán',
        value: summary.paidOrders,
        unit: 'đơn',
        icon: <Sprout size={22} />,
        color: 'amber' as ColorKey,
      },
      {
        label: 'Số lượng sản phẩm',
        value: summary.totalProducts,
        unit: 'sản phẩm',
        icon: <Boxes size={22} />,
        color: 'blue' as ColorKey,
      },
    ];
  }, [summary]);

  // ==========================
  // RENDER
  // ==========================

  return (
    <div className="admin_dashboard min-h-screen bg-gray-50/50 p-3 sm:p-4 lg:p-6">
      <Spin spinning={loading} size="large">
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
                  Hệ thống đang hoạt động
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight">
                Tổng quan hệ thống
              </h3>
              <p className="text-white/70 text-sm sm:text-base mt-1.5">
                Theo dõi doanh thu, đơn hàng và hiệu suất kinh doanh
              </p>
            </div>
            <button
              onClick={fetchDashboard}
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 text-sm font-medium text-white hover:bg-white/25 hover:border-white/35 active:bg-white/30 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 cursor-pointer"
            >
              <RefreshCw
                size={15}
                className={loading ? 'animate-spin' : ''}
              />
              Làm mới
            </button>
          </div>
        </section>

        {/* SUMMARY CARDS */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          {summaryCards.map((item, index) => {
            const c = colorMap[item.color];
            return (
              <div
                key={index}
                className="group bg-white p-3 sm:p-4 lg:p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`${c.iconBg} ${c.icon} p-2.5 rounded-xl ring-1 ${c.ring} group-hover:scale-105 transition-transform`}
                  >
                    {item.icon}
                  </div>
                </div>
                <div>
                  <p className="text-[11px] sm:text-xs text-gray-400 font-medium leading-tight">
                    {item.label}
                  </p>
                  <h4
                    className={`text-lg sm:text-xl lg:text-2xl font-bold ${c.value} mt-1 tabular-nums leading-tight break-all`}
                  >
                    {item.unit === 'đ'
                      ? formatCurrency(item.value)
                      : formatNumber(item.value)}
                  </h4>
                  {item.unit !== 'đ' && (
                    <span className="text-[11px] sm:text-xs text-gray-400 font-normal">
                      {item.unit}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </section>

        {/* CHARTS + ASIDE */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4 sm:mb-6">
          {/* Revenue Chart */}
          <section className="lg:col-span-3 bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
              Biểu đồ doanh thu {chartYear}
            </h3>
            {chartData.length > 0 ? (
              <div className="h-[220px] sm:h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#f0f0f0"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12, fill: '#9ca3af' }}
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
                    {/* <Tooltip
                      formatter={(value: number) => [
                        formatCurrency(value),
                        'Doanh thu',
                      ]}
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                      }}
                    /> */}
                    <Tooltip
  formatter={(value) => [
    formatCurrency(Number(value ?? 0)),
    'Doanh thu',
  ]}
  contentStyle={{
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
  }}
/>
                    <Bar
                      dataKey="revenue"
                      fill="url(#barGradient)"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={40}
                    />
                    <defs>
                      <linearGradient
                        id="barGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#10b981"
                          stopOpacity={0.9}
                        />
                        <stop
                          offset="100%"
                          stopColor="#06b6d4"
                          stopOpacity={0.7}
                        />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 p-6 min-h-[160px] flex items-center justify-center">
                <p className="text-gray-400 text-sm">
                  Chưa có dữ liệu doanh thu
                </p>
              </div>
            )}
          </section>

          {/* Quick Stats */}
          <aside className="lg:col-span-2 bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
              Thống kê nhanh
            </h3>
            {summary ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100/60">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <TrendingUp size={16} className="text-emerald-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      Đơn hoàn thành
                    </span>
                  </div>
                  <span className="text-sm font-bold text-emerald-700">
                    {formatNumber(summary.completedOrders)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100/60">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                      <Package size={16} className="text-amber-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      Đơn đang chờ
                    </span>
                  </div>
                  <span className="text-sm font-bold text-amber-700">
                    {formatNumber(summary.pendingOrders)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-100/60">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center">
                      <TrendingDown size={16} className="text-rose-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      Đơn huỷ
                    </span>
                  </div>
                  <span className="text-sm font-bold text-rose-700">
                    {formatNumber(summary.cancelledOrders)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-sky-50 to-cyan-50 border border-sky-100/60">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center">
                      <WalletCards size={16} className="text-sky-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      Khách hàng
                    </span>
                  </div>
                  <span className="text-sm font-bold text-sky-700">
                    {formatNumber(summary.totalCustomers)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-12 rounded-xl bg-gray-100 animate-pulse"
                  />
                ))}
              </div>
            )}
          </aside>
        </section>

        {/* RECENT ORDERS */}
        <section className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
            Đơn hàng gần đây
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-3 py-2.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Mã đơn
                  </th>
                  <th className="px-3 py-2.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Khách hàng
                  </th>
                  <th className="px-3 py-2.5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Giá trị
                  </th>
                  <th className="px-3 py-2.5 text-center text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Trạng thái
                  </th>
                  <th className="px-3 py-2.5 text-center text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Thanh toán
                  </th>
                  <th className="px-3 py-2.5 text-center text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Ngày đặt
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.length === 0 && !loading && (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-12 text-center text-gray-400"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Package size={32} className="text-gray-300" />
                        <p className="text-sm">Chưa có đơn hàng nào</p>
                      </div>
                    </td>
                  </tr>
                )}
                {recentOrders.map((order) => (
                  <tr
                    key={order.orderId}
                    className="hover:bg-gray-50/50 transition-colors duration-150"
                  >
                    <td className="px-3 py-3 font-bold text-emerald-700 whitespace-nowrap text-sm">
                      #{order.orderId}
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-900 whitespace-nowrap">
                      {order.customerUsername}
                    </td>
                    <td className="px-3 py-3 text-right font-semibold text-gray-900 whitespace-nowrap text-sm">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="px-3 py-3 text-center hidden sm:table-cell">
                      {statusBadge(order.orderStatusName)}
                    </td>
                    <td className="px-3 py-3 text-center hidden md:table-cell">
                      {paymentBadge(order.paymentStatusName)}
                    </td>
                    <td className="px-3 py-3 text-center text-sm text-gray-500 whitespace-nowrap hidden lg:table-cell">
                      {formatDate(order.orderedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </Spin>
    </div>
  );
}
