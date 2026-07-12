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
import { useEffect } from 'react'
import PaymentOnline from '../components/order/PaymentOnline'
import { CustomerProvider } from '../context/CustomerContext'
import ProfileInfo from '../components/ProfileInfo'
import ProfileAddress from '../components/ProfileAddress'
import MyOrder from '../components/order/MyOrder'
// import NotificationProvider from '../context/notification.context'

export default function CustomerLayout() {
  const NAV_LINKS = [
    { label: 'Home', to: '/' },
    { label: 'Products', to: '/products' },
    { label: 'Blog', to: '/blog' },
    { label: 'Carbon-Calculator', to: '/carbon-calculator' },
    { label: 'About Us', to: '/about' },
  ]

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
            <Route path="favorites" element={<h1>Sản phẩm yêu thích</h1>} />
          </Route>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Signup />} />
          <Route path="carbon-calculator" element={<h1>Carbon Calculator</h1>} />
        </Routes>
      </main>

      <footer className="footer-cus">
        <Footer />
      </footer>
    </div>
  )
}
