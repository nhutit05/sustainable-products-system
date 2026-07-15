import { Leaf, LogOut, UserCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { NavLink } from 'react-router-dom'

interface AdminNavbarProps {
  NAV_LINKS: {
    label: string
    child_links: {
      label: string
      to: string
      icon: React.ReactNode
    }[]
  }[]
  collapsed: boolean
  onToggleCollapse: () => void
  mobileOpen: boolean
  onCloseMobile: () => void
}

export default function AdminNavbar({
  NAV_LINKS,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}: AdminNavbarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [token, setToken] = useState(localStorage.getItem('token'))

  const handleLogout = () => {
    setToken('')
    localStorage.removeItem('token')
    navigate('/login')
  }

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        await fetch('http://localhost:8080/api/auth/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
      } catch {
        // ignore
      }
    }
    fetchAdmin()
  }, [token])

  useEffect(() => {
    onCloseMobile()
  }, [location.pathname, onCloseMobile])

  const sidebarWidth = collapsed ? 'w-[72px]' : 'w-[260px]'

  const sidebarContent = (
    <nav
      className={`
        admin-navbar bg-[#111A31] text-white flex flex-col h-full
        overflow-y-auto overflow-x-hidden
        scrollbar-thin scrollbar-thumb-emerald-300/30 scrollbar-track-transparent
        transition-all duration-300 ease-in-out
        ${sidebarWidth}
      `}
    >
      {/* LOGO */}
      <header className="flex-shrink-0">
        <div className="flex items-center gap-2.5 border-b border-white/10 px-4 py-4">
          <div className="bg-emerald-500 rounded-xl w-9 h-9 flex items-center justify-center flex-shrink-0">
            <Leaf className="text-white" size={18} />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0 overflow-hidden">
              <span className="font-['Bricolage_Grotesque',sans-serif] text-xl font-extrabold text-white tracking-tight leading-none">
                Re<span className="text-emerald-400">Green</span>
              </span>
              <span className="text-[10px] text-gray-400 font-medium tracking-wide mt-0.5">
                Admin Panel v1.0
              </span>
            </div>
          )}
        </div>
      </header>

      {/* NAV LINKS */}
      <main className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
        {NAV_LINKS.map((navItem, index) => (
          <div key={index} className="mb-3">
            {!collapsed && (
              <span className="font-semibold text-[10px] uppercase tracking-wider text-gray-500 px-3 mb-1.5 block">
                {navItem.label}
              </span>
            )}
            {collapsed && <div className="mx-auto w-5 h-px bg-gray-700 mb-2" />}
            <ul className="space-y-0.5">
              {navItem.child_links.map((child, childIndex) => {
                const isActive = location.pathname === child.to
                return (
                  <li key={childIndex}>
                    <NavLink
                      to={child.to}
                      title={collapsed ? child.label : undefined}
                      className={`
                        flex items-center gap-3 rounded-lg text-sm transition-all duration-150
                        ${collapsed ? 'justify-center px-2 py-2.5 mx-1' : 'px-3 py-2.5 mx-1'}
                        ${
                          isActive
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                        }
                      `}
                    >
                      <span className={`flex-shrink-0 ${isActive ? 'text-emerald-400' : ''}`}>
                        {child.icon}
                      </span>
                      {!collapsed && <span className="truncate font-medium">{child.label}</span>}
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </main>

      {/* COLLAPSE TOGGLE (tablet+) */}
      <div className="hidden lg:flex flex-shrink-0 justify-center border-t border-white/10 py-2">
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-lg text-gray-500 hover:bg-white/5 hover:text-gray-300 transition-colors cursor-pointer"
          title={collapsed ? 'Mở rộng' : 'Thu gọn'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* ACCOUNT + LOGOUT */}
      <footer className="flex-shrink-0 border-t border-white/10 p-3">
        <div
          className={`flex items-center gap-3 rounded-xl bg-white/5 p-2.5 ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <div className="w-9 h-9 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <UserCircle className="text-emerald-400" size={20} />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-white truncate">Admin</span>
              <span className="text-[10px] text-emerald-400 font-medium">Quản trị viên</span>
            </div>
          )}
        </div>

        {!collapsed && (
          <button
            onClick={handleLogout}
            className="w-full mt-2 px-3 py-2.5 text-sm text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors rounded-lg flex items-center gap-2 cursor-pointer"
          >
            <LogOut size={16} />
            <span>Đăng xuất</span>
          </button>
        )}
        {collapsed && (
          <button
            onClick={handleLogout}
            className="w-full mt-2 flex justify-center py-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
            title="Đăng xuất"
          >
            <LogOut size={16} />
          </button>
        )}
      </footer>
    </nav>
  )

  return (
    <>
      {/* Desktop & Tablet sidebar */}
      <aside
        className={`
          hidden lg:block flex-shrink-0 h-screen sticky top-0
          transition-all duration-300 ease-in-out
          ${sidebarWidth}
        `}
      >
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`
          lg:hidden fixed inset-y-0 left-0 z-50
          transform transition-transform duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {sidebarContent}
      </aside>
    </>
  )
}
