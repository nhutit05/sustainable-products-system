import './App.css'

import { Routes, Route, useNavigate } from 'react-router-dom'
import CustomerLayout from './layouts/CustomerLayout'
import AdminLayout from './layouts/AdminLayout'
import { useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'

function App() {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const decodedToken = jwtDecode(token)
        const currentTime = Date.now() / 1000

        // Nếu thời gian hiện tại lớn hơn thời gian hết hạn (exp) của token
        if (decodedToken?.exp && decodedToken.exp < currentTime) {
          alert('Phiên đăng nhập đã hết hạn, hệ thống sẽ tự động tải lại!')
          localStorage.removeItem('token') // Xóa token hết hạn
          window.location.reload() // Tự động reload lại trang
          navigate('/login') // Đá về trang login
        }
      } catch (error) {
        // Token lỗi/không hợp lệ
        localStorage.removeItem('token')
        navigate('/login')
      }
    }
  }, [navigate])
  return (
    <>
      <Routes>
        <Route path="/*" element={<CustomerLayout />} />

        <Route path="/admin/*" element={<AdminLayout />} />
      </Routes>
    </>
  )
}

export default App
