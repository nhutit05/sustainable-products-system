import { Heart, MapPinIcon, Package, SquareArrowDownRight, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

interface NavbarItem {
  NAV_LINKS: { label: string; to: string; icon: React.ReactNode }[]
}

export default function NavbarProfile({ NAV_LINKS }: NavbarItem) {
  const navigate = useNavigate()

  const location = useLocation()

  // const [activeItem, setActiveItem] = useState<number | null>(0)

  const currentPath = location.pathname
  const activeIndex = NAV_LINKS.findIndex((item) => {
    if (item.to === '') {
      return currentPath.endsWith('/profile') || currentPath.split('/').filter(Boolean).length === 1
    }
    return currentPath.includes(`/${item.to}`)
  })

  // 2. Gán giá trị trực tiếp cho biến activeItem
  const activeItem = activeIndex !== -1 ? activeIndex : null

  const handleSignOut = () => {
    const confirmed = window.confirm('Bạn có chắc chắn muốn đăng xuất không?')
    if (confirmed) {
      // Perform sign out logic here (e.g., clear user session, redirect to login page)
      console.log('User signed out')
      localStorage.removeItem('token')
      navigate('/login')
    }
  }

  return (
    <nav className="profile-navbar">
      <ul className="flex flex-col space-y-2">
        {NAV_LINKS.map((item, index) => (
          <li
            key={index}
            className={`flex items-center text-green-900 gap-2 p-3 rounded-2xl hover:bg-emerald-50 cursor-pointer ${activeItem === index ? 'bg-primary text-white font-bold' : ''}`}
            onClick={() => {
              navigate(item.to)
              // setActiveItem(index)
            }}
          >
            {item.icon}
            <span>{item.label}</span>
          </li>
        ))}
        <li
          key={-1}
          className={`flex items-center text-red-500 gap-2 p-3 rounded-2xl hover:bg-red-50 cursor-pointer `}
          onClick={handleSignOut}
        >
          <SquareArrowDownRight className="w-5 h-5" />
          <span>Đăng xuất</span>
        </li>
      </ul>
    </nav>
  )
}
