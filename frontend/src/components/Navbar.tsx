import { Bell, Heart, Leaf, Menu, Search, ShoppingCart, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import NavbarAccount from './NavbarAccount'

interface NavbarProps {
  NAV_LINKS: { label: string; to: string }[]
}

export default function Navbar({ NAV_LINKS }: NavbarProps) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()

  const location = useLocation()

  const isHome = location.pathname === '/'

  const [userExist, setUserExist] = useState<boolean>(false)

  const [totalItems, setTotalItems] = useState<number>()

  const token = localStorage.getItem('token')

  const [activeLink, setActiveLink] = useState<string>(location.pathname)

  useEffect(() => {
    const handlerScroll = () => {
      setScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handlerScroll)

    const checkUserExist = () => {
      if (token) {
        setUserExist(true)
      } else {
        setUserExist(false)
      }
    }

    const totalItemsInCart = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        setTotalItems(0)
        return
      }
      try {
        const response = await fetch('http://localhost:8080/api/cart-items', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await response.json()
        setTotalItems(data.length)
      } catch (error) {
        console.error('Error fetching total items in cart:', error)
      }
    }

    checkUserExist()
    totalItemsInCart()

    return () => {
      window.removeEventListener('scroll', handlerScroll)
    }
  }, [userExist, token])

  const transparent = isHome && !scrolled

  useEffect(() => {
    const closeNavbar = () => {
      setOpen(false)
    }

    const updateActiveLink = () => {
      setActiveLink(location.pathname)
    }

    updateActiveLink()

    closeNavbar()
  }, [location.pathname])

  return (
    <nav
      className={`navbar-cus fixed top-0 left-0 right-0 z-50 bg-white shadow-md 
        ${transparent ? 'bg-transparent' : 'bg-white/80 backdrop-blur-xl shadow-lg border-b border-green-100 transition-all duration-300'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-8">
        <div className="header-navbar h-14 sm:h-16 flex items-center justify-between gap-4  ">
          {/* LOGO */}
          <div className="flex items-center gap-2">
            <div
              className="navbar_logo p-2 rounded-2xl bg-primary shadow-md  hover:scale-105 transition-transform hover:cursor-pointer"
              onClick={() => navigate('/')}
            >
              <Leaf className="text-white" />
            </div>
            <span className="hidden sm:block font-['Bricolage_Grotesque',sans-serif] text-lg lg:text-xl font-extrabold text-green-800 tracking-tight">
              Re<span className="text-emerald-500">Green</span>
            </span>
          </div>
          <ul className="navbar_links hidden lg:flex items-center gap-2 shrink-0 group">
            {NAV_LINKS.map((link, index) => (
              <li
                className={`navbar_item ${activeLink === link.to ? 'font-bold rounded-2xl bg-emerald-100 text-green-700' : ''} flex items-center transition-all duration-300 `}
                key={index}
              >
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
              <span
                className="absolute top-0.5 right-0.5 min-w-4.5 h-4.5 px-1 
                text-[10px] font-bold text-white bg-emerald-500 rounded-full flex items-center justify-center"
              >
                {totalItems}
              </span>
            </Link>
            <button className="hidden lg:flex relative p-2 rounded-lg text-green-700 hover:bg-green-100 transition-colors">
              <Heart className="w-5 h-5" />
            </button>
            <button className="hidden lg:flex relative p-2 rounded-lg text-green-700 hover:bg-green-100 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            {userExist ? (
              <NavbarAccount />
            ) : (
              <div className="hidden lg:flex items-center gap-2 ml-1">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-sm font-semibold text-green-800 hover:text-emerald-600 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-primary from-emerald-500 to-teal-600 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden p-2 rounded-lg text-green-800 hover:bg-green-100 transition-colors"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-t border-green-100 shadow-xl animate-in slide-in-from-top">
          <div className="flex flex-col px-6 py-4 space-y-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={`py-3 px-3 rounded-lg hover:bg-green-50 font-medium text-green-800 ${activeLink === link.to ? 'font-bold rounded-2xl bg-emerald-100 text-green-700' : ''}`}
              >
                {link.label}
              </Link>
            ))}

            {!userExist && (
              <>
                <Link to="/login" className="py-3 text-green-700 font-semibold">
                  Log In
                </Link>

                <Link
                  to="/register"
                  className="bg-primary text-white rounded-xl py-3 text-center font-semibold "
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
