import { BanknoteCheck, Boxes, Sprout, WalletCards } from 'lucide-react'

export default function AdminDashboard() {
  // GIA LAP SUMMARY DATA
  const summary = [
    {
      label: 'Doanh số tháng này',
      value: 428367000,
      unit: 'đ',
      icon: <BanknoteCheck />,
      rate: 0.12,
      color: 'gray',
    },
    {
      label: 'Số lượng đơn hàng',
      value: 1245,
      unit: 'đơn',
      icon: <WalletCards />,
      rate: -0.05,
      color: 'green',
    },
    {
      label: 'CO2 cắt giảm tổng hợp',
      value: 987,
      unit: 'kg',
      icon: <Sprout />,
      rate: 0.08,
      color: 'amber',
    },
    {
      label: 'Số lượng sản phẩm',
      value: 356,
      unit: 'sản phẩm',
      icon: <Boxes />,
      rate: 0.02,
      color: 'blue',
    },
  ]

  return (
    <div className="admin_dashboard text-left">
      {/* DASHBOARD CONTENT */}
      <div className="px-4">
        {/* DASHBOARD BANNER */}
        <section className="adm_dashboard-banner  p-4 mb-4 rounded-2xl bg-[radial-gradient(circle_at_45%_50%,rgba(16,185,129,0.18)_0%,transparent_45%),linear-gradient(to_right,#0E1D2C,#0D3D39,#0E1D2C)]">
          <h3 className="text-xl font-semibold text-white py-2">
            Chào mừng bạn đến với trang tổng quan hệ thống
          </h3>
          <p className="text-emerald-600">
            Hệ thống thương mại điển tử xanh đang vận hành ổn định. Tỷ lệ đáp ứng 99.5% hằng năm.
          </p>
        </section>

        {/* DASHBOARD SUMMARY */}
        <section className="adm_dashboard-summary grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {summary.map((item, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-2xl shadow-xs flex items-center justify-between"
            >
              <div className="">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm uppercase py-2">{item.label}</p>
                    <h4 className={`text-2xl font-bold text-${item.color}-400`}>
                      {item.value.toLocaleString()} {item.unit}
                    </h4>
                  </div>
                </div>
                <p className={`text-sm mt-2 ${item.rate >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {item.rate >= 0 ? '+' : ''}
                  {(item.rate * 100).toFixed(2)}%
                </p>
              </div>
              <div
                className={`adm_dashboard-summary-icon text-${item.color}-500 border border-${item.color}-200 p-2 rounded-xl mt-4 inline-block`}
              >
                {item.icon}
              </div>
            </div>
          ))}
        </section>

        {/* DASHBOARD CHARTS + ASIDE CUSTOM*/}
        <section className="grid grid-cols-5 lg:grid-cols-5 md:grid-cols-1 gap-4">
          <section className="adm_dashboard-charts col-span-3 mt-4 bg-white p-4 rounded-2xl shadow-xs">
            <h3 className="text-xl font-semibold text-green-900 mb-2">Biểu đồ thống kê</h3>
            <div className="adm_dashboard-charts-content  rounded-2xl bg-amber-100 p-4 h-24">
              <p className="text-gray-500 text-sm">Biểu đồ sẽ được hiển thị ở đây</p>
            </div>
          </section>

          {/* CUSTOM ASIDE */}
          <aside className="adm_dashboard-aside mt-4 col-span-2 bg-white  p-4 rounded-2xl shadow-xs">
            <h3 className="text-xl font-semibold text-green-900 mb-2">Thông tin nhanh</h3>
            <div className="adm_dashboard-aside-content rounded-2xl bg-sky-200 p-4 h-24">
              <p className="text-gray-500 text-sm">Thông tin nhanh sẽ được hiển thị ở đây</p>
            </div>
          </aside>
        </section>

        {/* DASHBOARD ADD SECTIONS */}
        <section className="bg-white rounded-2xl p-4 mt-4 min-h-40 grid grid-cols-1 shadow-xs">
          <h2 className="text-lg font-semibold text-green-900">Section title</h2>
          <div className="p-4 bg-sky-200 rounded-2xl">
            <p className="text-gray-500 text-sm">Nội dung section sẽ được hiển thị ở đây</p>
          </div>
        </section>

        {/* DASHBOARD ADD SECTIONS */}
        <section className="bg-white rounded-2xl p-4 mt-4 min-h-40 grid grid-cols-1 shadow-xs">
          <h2 className="text-lg font-semibold text-green-900">Section title</h2>
          <div className="p-4 bg-sky-200 rounded-2xl">
            <p className="text-gray-500 text-sm">Nội dung section sẽ được hiển thị ở đây</p>
          </div>
        </section>
      </div>
    </div>
  )
}
