import { Leaf } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Cart() {
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setCurrentUser(data)
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    }
    if (token) {
      fetchUser()
    }
  }, [])

  return (
    <div className="page-cus_cart mt-14 min-h-screen bg-[#F8FFF4] text-left">
      <div className="max-w-7xl mx-auto">
        {/* Cart Header */}
        <header className="cart-header">
          {/* Breadcrumb */}
          <div className="max-w-7xl mx-auto px-3 py-4">
            <nav className="text-sm text-green-700">
              <Link to="/" className="hover:text-green-900">
                Trang chủ
              </Link>
              <span className="mx-2">/</span>
              <span className="text-green-900 font-medium">Giỏ hàng </span>
            </nav>
          </div>

          {/* Cart Title */}
          <div className="max-w-7xl mx-auto px-3 py-4">
            <h1 className="text-3xl font-bold text-green-900">
              Giỏ hàng <span className="text-lg text-emerald-400 font-medium">(3 sản phẩm)</span>
            </h1>
          </div>
        </header>

        {/* Cart Content */}
        <main className="cart-main grid grid-cols-3 gap-6">
          <main className="cart-content grid col-span-2 rounded-2xl">
            {/* Summary eco points and carbon_index reduce */}
            <div className="cart_summary--note bg-emerald-50 rounded-2xl border border-emerald-200 p-4 mb-6">
              <p className="text-emerald-700">
                <Leaf className="inline-block mr-2" size={22} />
                Bạn sẽ nhận được <span className="font-bold"> 150 </span> điểm sinh thái và giảm{' '}
                <span className="font-bold">0.5kg</span> khí thải carbon khi hoàn thành đơn hàng
                này.
              </p>
            </div>

            {/* Cart list items */}
            <div className="cart_list"></div>
          </main>

          <aside className="cart-aside grid col-s rounded-2xl">
            <div className=" bg-white rounded-2xl border border-emerald-200 p-4">
              <h2 className="text-xl font-bold text-green-900 mb-4">Tóm tắt đơn hàng</h2>
              <div className="cart-aside--summary"></div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  )
}
