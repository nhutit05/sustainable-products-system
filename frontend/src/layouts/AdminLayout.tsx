import {
  Box,
  ChartColumnBig,
  FileChartColumn,
  FolderTree,
  RotateCcw,
  ShoppingCart,
  Ticket,
  Warehouse,
  CloudUpload,
  Menu,
} from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import AdminNavbar from '../components/admin/AdminNavbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import AdminDashboard from '../pages/AdminDashboard'
import AdminSystemCategories from '../pages/AdminSystemCategories'
import AdminOrders from '../pages/AdminOrders'
import AdminProducts from '../pages/AdminProducts'
import KnowledgePage from '../pages/knowledge/KnowledgePage'
import AdminVouchers from '../pages/AdminVouchers'
import AdminRefundSlip from '../pages/AdminRefundSlip'
import { useNotification } from '../context/useNotification'

export default function AdminLayout() {
  const location = useLocation()
  const { showNotification } = useNotification()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleCloseMobile = useCallback(() => setMobileOpen(false), [])

  const NAV_LINKS = [
    {
      label: 'Hệ thống tổng quan',
      child_links: [
        {
          label: 'Trang tổng quan',
          title: 'Trang tổng quan hệ thống',
          to: '/admin/dashboard',
          icon: <ChartColumnBig size={18} />,
        },
        {
          label: 'Trung tâm báo cáo đa loại',
          title: 'Trung tâm báo cáo đa loại',
          to: '/admin/reports',
          icon: <FileChartColumn size={18} />,
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
          icon: <FolderTree size={18} />,
        },
        {
          label: 'Danh mục sản phẩm',
          title: 'Danh mục sản phẩm',
          to: '/admin/products',
          icon: <Box size={18} />,
        },
        {
          label: 'Quản lý kho hàng',
          title: 'Quản lý kho hàng',
          to: '/admin/warehouses',
          icon: <Warehouse size={18} />,
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
          icon: <ShoppingCart size={18} />,
        },
        {
          label: 'Xử lý hoàn tiền',
          title: 'Xử lý hoàn tiền',
          to: '/admin/refunds',
          icon: <RotateCcw size={18} />,
        },
        {
          label: 'Quản lý voucher',
          title: 'Quản lý voucher',
          to: '/admin/vouchers',
          icon: <Ticket size={18} />,
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
          icon: <CloudUpload size={18} />,
        },
      ],
    },
  ]

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  // Check token validity on mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      showNotification({
        message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
        type: 'ERROR',
        duration: 5000,
      })
      window.location.href = '/login'
      return
    }

    const checkToken = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/admin/orders?page=0&size=1', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('token')
          showNotification({
            message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
            type: 'ERROR',
            duration: 5000,
          })
          window.location.href = '/login'
        }
      } catch {
        // Network error - ignore, let individual pages handle their own errors
      }
    }

    checkToken()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const currentPageTitle =
    NAV_LINKS.flatMap((link) => link.child_links).find(
      (childLink) => childLink.to === location.pathname
    )?.title || 'Trang tổng quan hệ thống'

  return (
    <div className="page-admin w-full min-h-screen flex bg-emerald-50/50">
      {/* SIDEBAR */}
      <AdminNavbar
        NAV_LINKS={NAV_LINKS}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((p) => !p)}
        mobileOpen={mobileOpen}
        onCloseMobile={handleCloseMobile}
      />

      {/* MAIN CONTENT */}
      <main
        className={`
          flex-1 min-w-0 min-h-screen
          transition-all duration-300 ease-in-out
        `}
      >
        {/* MOBILE / TABLET HEADER */}
        <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 px-4 py-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 -ml-1 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2">
              <div className="bg-emerald-500 rounded-lg w-7 h-7 flex items-center justify-center">
                <span className="text-white text-xs font-bold">R</span>
              </div>
              <span className="font-['Bricolage_Grotesque',sans-serif] text-lg font-extrabold text-gray-800 tracking-tight">
                Re<span className="text-emerald-600">Green</span>
              </span>
            </div>
          </div>
        </header>

        {/* DESKTOP HEADER */}
        <header className="hidden lg:block sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm">
          <div className="px-6 py-4">
            <h2 className="text-xl font-bold text-gray-800">{currentPageTitle}</h2>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="p-3 sm:p-4 lg:p-6">
          <Routes>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="reports" element={<h1>Reports</h1>} />
            <Route path="categories" element={<AdminSystemCategories />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="warehouses" element={<h1>Warehouses</h1>} />
            <Route path="refunds" element={<AdminRefundSlip />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="vouchers" element={<AdminVouchers />} />
            <Route path="knowledge" element={<KnowledgePage />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}
