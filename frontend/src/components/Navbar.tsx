import { Bell, Heart, Leaf, Menu, Search, ShoppingCart, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

interface NavbarProps {
  NAV_LINKS: { label: string; to: string }[]
}

export default function Navbar({ NAV_LINKS }: NavbarProps) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const location = useLocation()

  const isHome = location.pathname === '/'

  useEffect(() => {
    const handlerScroll = () => {
      setScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handlerScroll)
    return () => {
      window.removeEventListener('scroll', handlerScroll)
    }
  }, [])

  const transparent = isHome && !scrolled

  return (
    <nav
      className={`navbar-cus fixed top-0 left-0 right-0 z-50 bg-white shadow-md 
        ${transparent ? 'bg-transparent' : 'bg-white/95 backdrop-blur-md shadow-sm border-b border-green-100'}`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="header-navbar h-16 flex items-center justify-between gap-4  ">
          <div className="flex items-center gap-2">
            <div className="navbar_logo p-2 rounded-2xl bg-primary shadow-md  hover:scale-105 transition-transform hover:cursor-pointer">
              <Leaf className="text-white" />
            </div>
            <span className="font-['Bricolage_Grotesque',sans-serif] text-xl font-extrabold text-green-800 tracking-tight">
              Re<span className="text-emerald-500">Green</span>
            </span>
          </div>
          <ul className="navbar_links flex items-center gap-2 shrink-0 group">
            {NAV_LINKS.map((link, index) => (
              <li className="navbar_item" key={index}>
                <Link
                  to={link.to}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                    transparent
                      ? 'text-green-900/80 hover:text-green-700 hover:bg-green-50/60'
                      : 'text-green-900/70 hover:text-green-700 hover:bg-green-50'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <button className="hidden lg:flex p-2 rounded-lg text-green-700 hover:bg-green-100 transition-colors">
              <Search className="w-4.5 h-4.5" />
            </button>
            <Link
              to="/cart"
              className="relative p-2 rounded-lg text-green-700 hover:bg-green-100 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute top-0.5 right-0.5 w-4 h-4 text-[10px] font-bold text-white bg-emerald-500 rounded-full flex items-center justify-center">
                2
              </span>
            </Link>
            <button className="hidden sm:flex relative p-2 rounded-lg text-green-700 hover:bg-green-100 transition-colors">
              <Heart className="w-5 h-5" />
            </button>
            <button className="hidden sm:flex relative p-2 rounded-lg text-green-700 hover:bg-green-100 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="hidden lg:flex items-center gap-2 ml-1">
              <Link
                to="/login"
                className="px-3 py-1.5 text-sm font-semibold text-green-800 hover:text-emerald-600 transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
              >
                Sign Up
              </Link>
            </div>
            <button
              onClick={() => setOpen(!open)}
              className="xl:hidden p-2 rounded-lg text-green-800 hover:bg-green-100 transition-colors"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
