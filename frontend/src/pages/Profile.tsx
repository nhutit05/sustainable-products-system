import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import type { customerResponse, meResponse } from '../model/customer'
import { Heart, Leaf, MapPinIcon, Package, User } from 'lucide-react'
import {
  CustomerTypeColor,
  CustomerTypeName,
  type CustomerTypeRoleKey,
} from '../enum/Customer.enum'
import NavbarProfile from '../components/NavbarProfile'
import { useCustomer } from '../context/useCustomer'

export default function Profile() {
  const navigate = useNavigate()

  const location = useLocation()

  const { token, customerData, setCustomerData } = useCustomer()

  const [user, setUser] = useState<meResponse | null>(null)

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/auth/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data: meResponse = await response.json()
          setUser({
            username: data.username,
            authorities: data.authorities,
          })
        }
      } catch (error) {
        console.error('Error fetching customer data:', error)
      }
    }

    if (token) {
      fetchUsername()
    }
  }, [token])

  useEffect(() => {
    // LAY THONG TIN CUSTOMER
    const fetchCustomer = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/customers/me?username=${user?.username}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (response.ok) {
          const data: customerResponse = await response.json()
          setCustomerData(data)
        }
      } catch (error) {
        console.error('Error fetching customer data:', error)
      }
    }

    fetchCustomer()
  }, [user?.username, token, setCustomerData])

  //   list navbar
  const navbarItems = [
    {
      label: 'Thông tin cá nhân',
      to: '',
      icon: <User className="w-5 h-5" />,
    },
    {
      label: 'Đơn hàng của tôi',
      to: 'orders',
      icon: <Package className="w-5 h-5" />,
    },
    {
      label: 'Quản lý địa chỉ',
      to: 'addresses',
      icon: <MapPinIcon className="w-5 h-5" />,
    },
    {
      label: 'Sản phẩm yêu thích',
      to: 'favorites',
      icon: <Heart className="w-5 h-5" />,
    },
  ]

  return (
    <div className="profile-page mt-12 p-4 bg-emerald-50">
      <div className="max-w-7xl mx-auto">
        {/* BANNER */}
        <section className="profile-banner p-4 mb-4 rounded-2xl bg-[radial-gradient(circle_at_45%_50%,rgba(16,185,129,0.18)_0%,transparent_45%),linear-gradient(to_right,#0E1D2C,#0D3D39,#0E1D2C)]">
          <h3 className="text-xl font-semibold text-white py-2">
            Chào mừng {customerData?.username || 'Bạn'} đến với trang quản lý thông tin cá nhân
          </h3>
          <p className="text-emerald-600">
            Thông tin cá nhân của bạn sẽ được hiển thị ở đây. Hãy đảm bảo rằng thông tin của bạn
            luôn được cập nhật và chính xác.
          </p>
        </section>

        {/* PROFILE INFORMATION */}
        <main className="profile-main grid grid-cols-3 gap-4">
          {/* PROFILE NAVBAR */}
          <section className="profile_info p-4 bg-white rounded-2xl shadow col-span-1">
            <div className="my-3 flex items-center gap-4 border-b border-green-100 pb-4">
              <div className="rounded-full border border-green-500 w-16 h-16 flex items-center justify-center overflow-hidden">
                <img
                  src={'/user_default.jpg'}
                  alt="Avatar"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-green-900 flex items-center gap-2 mb-2">
                  {customerData?.username}
                  <div
                    className={`w-fit rounded-full bg-amber-100 shadow-amber-200 px-4 py-1 ml-3`}
                  >
                    <div
                      className={`w-full h-full flex items-center font-semibold text-xs justify-center text-amber-500`}
                    >
                      {CustomerTypeName[user?.authorities[0].authority as CustomerTypeRoleKey] ||
                        'Người dùng'}
                    </div>
                  </div>
                </h3>
                <p className="text-sm font-medium text-emerald-400 flex items-center">
                  <Leaf className="inline-block mr-2" size={20} />
                  Điểm tích lũy:{' '}
                  <span className="font-bold ml-4">
                    {customerData?.accumulatedEcoPoints.toLocaleString() || 0}
                  </span>
                </p>
              </div>
            </div>
            {/* LIST NAVBAR */}
            <NavbarProfile NAV_LINKS={navbarItems} />
          </section>

          <section className="p-4 bg-white rounded-2xl shadow col-span-2">
            {token ? (
              <Outlet />
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">
                  Bạn cần đăng nhập để truy cập trang này.
                </h3>
                <button
                  onClick={() => navigate('/login', { state: { from: location } })}
                  className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 hover:cursor-pointer transition-colors"
                >
                  Đăng nhập
                </button>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}
