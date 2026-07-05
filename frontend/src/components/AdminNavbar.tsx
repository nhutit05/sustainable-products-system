import { Leaf, LogOut, UserCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

interface AdminNavbarProps {
  NAV_LINKS: {
    label: string
    child_links: {
      label: string
      to: string
      icon: React.ReactNode
    }[]
  }[]
}

export default function AdminNavbar({ NAV_LINKS }: AdminNavbarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [adminInfo, setAdminInfo] = useState(null)

  const handleLogout = () => {
    setToken('')
    localStorage.removeItem('token')
    navigate('/login')
  }

  useEffect(() => {
    const fetchAdmin = async () => {
      const res = await fetch('http://localhost:8080/api/auth/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await res.json()
    }

    fetchAdmin()
  }, [token])

  return (
    <nav className="admin-navbar bg-[#111A31] text-white p-4 flex flex-col h-full overflow-y-scroll scrollbar-thin scrollbar-thumb-emerald-300 scrollbar-track-emerald-100">
      {/* ADMIN NAVBAR LOGO REGREEN */}
      <header className="adm-navbar-header">
        <div className="flex items-center gap-2 border-b border-gray-800 py-3">
          <div className="bg-primary rounded-2xl w-10 h-10 flex items-center justify-center">
            <Leaf className="text-white" size={20} />
          </div>
          <div className="flex flex-col">
            <span className="font-['Bricolage_Grotesque',sans-serif] text-2xl font-extrabold text-green-800 tracking-tight">
              Re<span className="text-emerald-500">Green</span>
            </span>
            <span className="text-xs text-white font-semibold tracking-tight">
              Admin Panel v1.0
            </span>
          </div>
        </div>
      </header>

      {/* NAVBAR CATEGORIES */}
      <main className="adm-nav-main flex-1">
        {NAV_LINKS.map((navItem, index) => (
          <div className="navItem_cate text-left" key={index}>
            {/* NAVBAR CATEGORY LABEL */}
            <span className="font-semibold text-md uppercase text-gray-400 py-2 my-2 block border-b border-gray-800">
              {navItem.label}
            </span>

            {/* NAVBAR CHILD LINKS */}
            <ul className="ml-4 space-y-2">
              {/* CHILD LINKS */}
              {navItem.child_links.map((child, childIndex) => (
                // NAVBAR CHILD LINK ITEM */}
                <li
                  key={childIndex}
                  className={`rounded-lg hover:bg-gray-600/70 transition-colors hover:cursor-pointer ${
                    location.pathname === child.to
                      ? 'bg-gray-600/70 border-l-4 border-emerald-400'
                      : ''
                  }`}
                >
                  <a
                    href={child.to}
                    className="flex items-center p-3 gap-2 text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {child.icon}
                    {child.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </main>

      {/* ADMIN ACCOUNT INFO & LOGOUT */}
      <footer className="adm-navbar-footer mt-auto border-t border-gray-800 pt-4">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/50">
          <div className="w-10 h-10 rounded-full bg-emerald-600/30 flex items-center justify-center flex-shrink-0">
            <UserCircle className="text-emerald-400" size={24} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-white truncate">Admin</span>
            <span className="text-xs text-emerald-400 font-medium">Quản trị viên</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full mt-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors rounded-lg flex items-center gap-2 cursor-pointer"
        >
          <LogOut size={18} />
          Đăng xuất
        </button>
      </footer>
    </nav>
  )
}
