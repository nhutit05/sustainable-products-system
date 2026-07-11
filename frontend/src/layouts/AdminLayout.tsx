import {
  Box,
  ChartColumnBig,
  FileChartColumn,
  FolderTree,
  RotateCcw,
  ShoppingCart,
  Ticket,
  Warehouse,
  CloudUpload
} from 'lucide-react'
import { useEffect } from 'react'
import AdminNavbar from '../components/AdminNavbar'
import { Route, Routes } from 'react-router-dom'
import AdminDashboard from '../pages/AdminDashboard'
import AdminSystemCategories from '../pages/AdminSystemCategories'
import AdminOrders from '../pages/AdminOrders'
import AdminProducts from '../pages/AdminProducts'
import KnowledgePage from '../pages/knowledge/KnowledgePage'

export default function AdminLayout() {
  // Set danh sach NAV_LINKS
  const NAV_LINKS = [
    {
      label: 'Hệ thống tổng quan',
      child_links: [
        {
          label: 'Trang tổng quan',
          title: 'Trang tổng quan hệ thống',
          to: '/admin/dashboard',
          icon: <ChartColumnBig />,
        },
        {
          label: 'Trung tâm báo cáo đa loại',
          title: 'Trung tâm báo cáo đa loại',
          to: '/admin/reports',
          icon: <FileChartColumn />,
        },
      ],
    },
    {
      label: 'Cấu hình dữ liệu',
      child_links: [
        {
          label: 'Danh mục hệ thống',
          title: 'Cấu hình quản lý danh mục hệ thống',
          to: '/admin/categories',
          icon: <FolderTree />,
        },
        {
          label: 'Danh mục sản phẩm',
          title: 'Danh mục sản phẩm',
          to: '/admin/products',
          icon: <Box />,
        },
        {
          label: 'Quản lý kho hàng',
          title: 'Quản lý kho hàng',
          to: '/admin/warehouses',
          icon: <Warehouse />,
        },
      ],
    },
    {
      label: 'Luồng giao dịch',
      child_links: [
        {
          label: 'Duyệt đơn hàng',
          title: 'Duyệt đơn hàng',
          to: '/admin/orders',
          icon: <ShoppingCart />,
        },
        {
          label: 'Xử lý hoàn tiền',
          title: 'Xử lý hoàn tiền',
          to: '/admin/refunds',
          icon: <RotateCcw />,
        },
        {
          label: 'Quản lý voucher',
          title: 'Quản lý voucher',
          to: '/admin/vouchers',
          icon: <Ticket />,
        },
      ],
    },
    {
      label: 'Quản trị tri thức',
      child_links: [
        {
          label: 'Quản lý tài liệu huấn luyện',
          title: 'Quản lý tài liệu huấn luyện',
          to: '/admin/knowledge',
          icon: <CloudUpload/>
        }
      ]
    }
  ]

  // Cau hinh scroll to top khi chuyen trang
  const location = window.location.pathname

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }, [location])

  // Banner bg: bg-gradient-to-r from-[#0E1D2C] to-[#093E36]

  return (
    <div className="page-admin w-full min-h-screen grid grid-cols-4 gap-4 ">
      <header className="header-adm max-h-screen">
        <AdminNavbar NAV_LINKS={NAV_LINKS} />
      </header>

      <main className=" main-adm text-left bg-emerald-50 rounded-2xl grid col-span-3 max-h-screen overflow-y-scroll scrollbar-thin scrollbar-thumb-emerald-300 scrollbar-track-emerald-100">
        {/* DASHBOARD HEADER */}
        <header className="adm_dashboard-header shadow-xs bg-white pl-4 mb-4 p-4 sticky top-0 left-0 right-0 z-10 max-h-fit border-b border-emerald-100">
          <h2 className="text-3xl font-bold text-green-900 uppercase">
            {NAV_LINKS.flatMap((link) => link.child_links).find(
              (childLink) => childLink.to === location
            )?.title || 'Trang tổng quan hệ thống'}
          </h2>
        </header>

        {/* LIST ROUTES */}
        <Routes>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="reports" element={<h1>Reports</h1>} />
          <Route path="categories" element={<AdminSystemCategories />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="warehouses" element={<h1>Warehouses</h1>} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="refunds" element={<h1>Refunds</h1>} />
          <Route path="vouchers" element={<h1>Vouchers</h1>} />
          <Route path="knowledge" element={<KnowledgePage />} />
        </Routes>
      </main>
    </div>
  )
}
