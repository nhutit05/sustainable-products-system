import { BanknoteCheck, Boxes, Sprout, WalletCards, TrendingUp, TrendingDown } from 'lucide-react'

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
} as const

type ColorKey = keyof typeof colorMap

export default function AdminDashboard() {
  const summary = [
    {
      label: 'Doanh số tháng này',
      value: 428367000,
      unit: 'đ',
      icon: <BanknoteCheck size={22} />,
      rate: 0.12,
      color: 'gray' as ColorKey,
    },
    {
      label: 'Số lượng đơn hàng',
      value: 1245,
      unit: 'đơn',
      icon: <WalletCards size={22} />,
      rate: -0.05,
      color: 'green' as ColorKey,
    },
    {
      label: 'CO₂ cắt giảm',
      value: 987,
      unit: 'kg',
      icon: <Sprout size={22} />,
      rate: 0.08,
      color: 'amber' as ColorKey,
    },
    {
      label: 'Số lượng sản phẩm',
      value: 356,
      unit: 'sản phẩm',
      icon: <Boxes size={22} />,
      rate: 0.02,
      color: 'blue' as ColorKey,
    },
  ]

  return (
    <div className="admin_dashboard min-h-screen bg-gray-50/50 p-3 sm:p-4 lg:p-6">
      {/* BANNER */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 p-5 sm:p-6 lg:p-8 mb-4 sm:mb-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(16,185,129,0.25)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(6,182,212,0.15)_0%,transparent_40%)]" />
        <div className="relative z-10">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
            Chào mừng bạn đến với trang tổng quan hệ thống
          </h3>
          <p className="text-emerald-300/80 text-sm sm:text-base mt-1.5 max-w-2xl">
            Hệ thống thương mại điện tử xanh đang vận hành ổn định. Tỷ lệ đáp ứng 99.5% hằng năm.
          </p>
        </div>
      </section>

      {/* SUMMARY CARDS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        {summary.map((item, index) => {
          const c = colorMap[item.color]
          return (
            <div
              key={index}
              className="group bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-4"
            >
              <div className={`${c.iconBg} ${c.icon} p-3 rounded-xl ring-1 ${c.ring} flex-shrink-0 group-hover:scale-105 transition-transform`}>
                {item.icon}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-500 font-medium truncate">{item.label}</p>
                <h4 className={`text-xl sm:text-2xl font-bold ${c.value} mt-0.5 tabular-nums`}>
                  {item.value.toLocaleString()}{' '}
                  <span className="text-sm font-normal text-gray-400">{item.unit}</span>
                </h4>
                <div className={`flex items-center gap-1 mt-1.5 text-xs font-medium ${item.rate >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {item.rate >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  <span>
                    {item.rate >= 0 ? '+' : ''}
                    {(item.rate * 100).toFixed(1)}%
                  </span>
                  <span className="text-gray-400 font-normal ml-0.5">so với tháng trước</span>
                </div>
              </div>
            </div>
          )
        })}
      </section>

      {/* CHARTS + ASIDE */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4 sm:mb-6">
        <section className="lg:col-span-3 bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Biểu đồ thống kê</h3>
          <div className="rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 p-6 min-h-[160px] flex items-center justify-center">
            <p className="text-gray-400 text-sm">Biểu đồ sẽ được hiển thị ở đây</p>
          </div>
        </section>

        <aside className="lg:col-span-2 bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Thông tin nhanh</h3>
          <div className="rounded-xl bg-gradient-to-br from-sky-50 to-cyan-50 border border-sky-100 p-6 min-h-[160px] flex items-center justify-center">
            <p className="text-gray-400 text-sm">Thông tin nhanh sẽ được hiển thị ở đây</p>
          </div>
        </aside>
      </section>

      {/* BOTTOM SECTIONS */}
      <section className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm mb-4">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Section title</h2>
        <div className="rounded-xl bg-gradient-to-br from-sky-50 to-cyan-50 border border-sky-100 p-6 min-h-[120px] flex items-center justify-center">
          <p className="text-gray-400 text-sm">Nội dung section sẽ được hiển thị ở đây</p>
        </div>
      </section>

      <section className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Section title</h2>
        <div className="rounded-xl bg-gradient-to-br from-sky-50 to-cyan-50 border border-sky-100 p-6 min-h-[120px] flex items-center justify-center">
          <p className="text-gray-400 text-sm">Nội dung section sẽ được hiển thị ở đây</p>
        </div>
      </section>
    </div>
  )
}
