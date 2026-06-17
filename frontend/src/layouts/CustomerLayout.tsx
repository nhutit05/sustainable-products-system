import { Route, Routes } from 'react-router'
import Navbar from '../components/Navbar'
import '../styles/customer.css'
import Homepage from '../pages/Homepage'
import Signup from '../pages/Signup'

export default function CustomerLayout() {
  const NAV_LINKS = [
    { label: 'Home', to: '/' },
    { label: 'Products', to: '/products' },
    { label: 'Community', to: '/community' },
    { label: 'About Us', to: '/about' },
    { label: 'Contact', to: '/contact' },
  ]

  return (
    <div className="page-customer container">
      <header className="header-cus ">
        <Navbar NAV_LINKS={NAV_LINKS} />
      </header>

      <main className="main-cus">
        <Routes>
          <Route path="" element={<Homepage />} />
          <Route path="products" element={<h1>Products</h1>} />
          <Route path="cart" element={<h1>Cart</h1>} />
          <Route path="me" element={<h1>Me</h1>} />
          <Route path="login" element={<h1>Login</h1>} />
          <Route path="register" element={<Signup />} />
        </Routes>
      </main>

      <footer className="footer-cus">Footer</footer>
    </div>
  )
}
