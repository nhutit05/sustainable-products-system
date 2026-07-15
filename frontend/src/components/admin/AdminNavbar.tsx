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
        admin-navbar text-white flex flex-col h-full
        bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900
        overflow-y-auto overflow-x-hidden
        scrollbar-thin scrollbar-thumb-emerald-400/20 scrollbar-track-transparent
        transition-all duration-300 ease-in-out
        ${sidebarWidth}
      `}
    >
      {/* LOGO */}
      <header className="flex-shrink-0">
        <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-5">
          <div className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl w-10 h-10 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/25">
            <Leaf className="text-white" size={20} />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0 overflow-hidden">
              <span className="font-['Bricolage_Grotesque',sans-serif] text-xl font-extrabold tracking-tight leading-none">
                <span className="text-white">Re</span>
                <span className="bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
                  Green
                </span>
              </span>
              <span className="text-[10px] text-gray-500 font-medium tracking-wider mt-0.5">
                Admin Panel v1.0
              </span>
            </div>
          )}
        </div>
      </header>

      {/* NAV LINKS */}
      <main className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {NAV_LINKS.map((navItem, index) => (
          <div key={index} className="mb-4">
            {!collapsed && (
              <span className="font-semibold text-[10px] uppercase tracking-widest text-gray-500/80 px-3 mb-2 block">
                {navItem.label}
              </span>
            )}
            {collapsed && (
              <div className="mx-auto w-5 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-2" />
            )}
            <ul className="space-y-1">
              {navItem.child_links.map((child, childIndex) => {
                const isActive = location.pathname === child.to
                return (
                  <li key={childIndex}>
                    <NavLink
                      to={child.to}
                      title={collapsed ? child.label : undefined}
                      className={`
                        flex items-center gap-3 rounded-xl text-sm transition-all duration-200 relative
                        ${collapsed ? 'justify-center px-2 py-2.5 mx-1' : 'px-3 py-2.5 mx-1'}
                        ${
                          isActive
                            ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/15 text-white shadow-sm shadow-emerald-500/10'
                            : 'text-gray-400 hover:bg-white/[0.05] hover:text-gray-200'
                        }
                      `}
                    >
                      {isActive && !collapsed && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-gradient-to-b from-emerald-400 to-teal-400" />
                      )}
                      <span
                        className={`flex-shrink-0 transition-colors duration-200 ${
                          isActive ? 'text-emerald-400' : ''
                        }`}
                      >
                        {child.icon}
                      </span>
                      {!collapsed && (
                        <span className="truncate font-medium">{child.label}</span>
                      )}
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </main>

      {/* COLLAPSE TOGGLE (tablet+) */}
      <div className="hidden lg:flex flex-shrink-0 justify-center border-t border-white/[0.06] py-2">
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-xl text-gray-500 hover:bg-white/[0.05] hover:text-gray-300 transition-all duration-200 cursor-pointer"
          title={collapsed ? 'Mở rộng' : 'Thu gọn'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* ACCOUNT + LOGOUT */}
      <footer className="flex-shrink-0 border-t border-white/[0.06] p-3">
        <div
          className={`flex items-center gap-3 rounded-xl bg-white/[0.04] border border-white/[0.06] p-2.5 ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400/25 to-teal-400/25 flex items-center justify-center flex-shrink-0 ring-1 ring-emerald-400/15">
            <UserCircle className="text-emerald-400" size={20} />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-white truncate">Admin</span>
              <span className="text-[10px] font-medium bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
                Quản trị viên
              </span>
            </div>
          )}
        </div>

        {!collapsed && (
          <button
            onClick={handleLogout}
            className="w-full mt-2 px-3 py-2.5 text-sm text-gray-500 hover:bg-rose-500/10 hover:text-rose-400 transition-all duration-200 rounded-xl flex items-center gap-2 cursor-pointer"
          >
            <LogOut size={16} />
            <span>Đăng xuất</span>
          </button>
        )}
        {collapsed && (
          <button
            onClick={handleLogout}
            className="w-full mt-2 flex justify-center py-2 text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all duration-200 cursor-pointer"
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
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-md transition-opacity"
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
