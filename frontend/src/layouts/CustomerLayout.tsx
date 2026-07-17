import { Route, Routes } from 'react-router'
import Navbar from '../components/Navbar'
import '../styles/customer.css'
import Homepage from '../pages/Homepage'
import Signup from '../pages/Signup'
import Login from '../pages/Login'
import Profile from '../pages/Profile'
import Footer from '../components/Footer'
import Products from '../pages/Products'
import ProductDetail from '../pages/ProductDetail'
import Cart from '../pages/Cart'
import { useEffect, useState } from 'react'
import PaymentOnline from '../components/order/PaymentOnline'
import { CustomerProvider } from '../context/CustomerContext'
import ProfileInfo from '../components/ProfileInfo'
import ProfileAddress from '../components/ProfileAddress'
import MyOrder from '../components/order/MyOrder'
import Chatbot from '../components/Chatbot'
import { Sparkles, X } from 'lucide-react'
import ProfileFavorite from '../components/ProfileFavorite'
// import NotificationProvider from '../context/notification.context'

export default function CustomerLayout() {
  const NAV_LINKS = [
    { label: 'Home', to: '/' },
    { label: 'Products', to: '/products' },
    { label: 'Blog', to: '/blog' },
    { label: 'Carbon-Calculator', to: '/carbon-calculator' },
    { label: 'About Us', to: '/about' },
  ]

  const [isChatbotOpen, setIsChatbotOpen] = useState(false)

  const [showWelcome, setShowWelcome] = useState(true)

  const location = window.location.pathname

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }, [location])

  return (
    <div className="page-customer container mx-auto ">
      <header className="header-cus ">
        <Navbar NAV_LINKS={NAV_LINKS} />
      </header>

      <main className="main-cus ">
        <Routes>
          <Route path="" element={<Homepage />} />
          <Route path="products">
            <Route path="" element={<Products />} />
            <Route
              path=":productId"
              element={
                <CustomerProvider>
                  <ProductDetail />
                </CustomerProvider>
              }
            />
          </Route>

          <Route
            path="cart"
            element={
              <CustomerProvider>
                <Cart />
              </CustomerProvider>
            }
          />
          <Route path="cart/:id/payment-online" element={<PaymentOnline />} />
          <Route
            path="profile"
            element={
              <CustomerProvider>
                <Profile />
              </CustomerProvider>
            }
          >
            <Route path="" element={<ProfileInfo />} />
            <Route path="orders" element={<MyOrder />} />
            <Route path="addresses" element={<ProfileAddress />} />
            <Route path="favorites" element={<ProfileFavorite />} />
          </Route>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Signup />} />
          <Route path="carbon-calculator" element={<h1>Carbon Calculator</h1>} />
        </Routes>
      </main>

      <footer className="footer-cus">
        <Footer />
      </footer>

      {/*  CHATBOT */}
      {!isChatbotOpen && (
        <div className="relative">
          <div
            onClick={() => setIsChatbotOpen(!isChatbotOpen)}
            className="fixed h-14 w-14 animate-float rounded-3xl bg-primary bottom-10 right-10 overflow-hidden hover:cursor-pointer active:scale-95 shadow-lg z-50"
          >
            <img
              src="https://res.cloudinary.com/dl9cupba4/image/upload/v1784038116/Chatbot_dv3g45.jpg"
              alt="Chatbot"
              className="w-full object-contains"
            />
          </div>

          {/* THÔNG BÁO CHÀO MỪNG */}
          <div
            className={`fixed bottom-10 right-28 z-50 w-72 rounded-2xl border border-emerald-100 
              bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.12)] 
                transition-all duration-500 ease-out origin-bottom-right
              ${
                showWelcome && !isChatbotOpen
                  ? 'opacity-100 translate-x-0 scale-100 animate-float'
                  : 'opacity-0 translate-x-4 scale-90 pointer-events-none'
              }`}
          >
            <button
              type="button"
              onClick={() => setShowWelcome(false)}
              className="absolute top-2 right-2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              aria-label="Đóng thông báo"
            >
              <X className="h-3.5 w-3.5" />
            </button>

            <div className="flex gap-3 pr-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Sparkles className="h-4.5 w-4.5" />
              </div>

              <div className="text-left">
                <p className="text-xs font-semibold text-emerald-800">Trợ lý ReGreen</p>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  Xin chào! Tôi là trợ lý ảo của bạn. Tôi có thể giúp gì cho bạn hôm nay?
                </p>
              </div>
            </div>

            <div className="absolute bottom-5 -right-1.5 h-3 w-3 rotate-45 border-r border-t border-emerald-100 bg-white" />
          </div>
        </div>
      )}
      {isChatbotOpen && (
        <Chatbot isChatbotOpen={isChatbotOpen} setIsChatbotOpen={setIsChatbotOpen} />
      )}
    </div>
  )
}
