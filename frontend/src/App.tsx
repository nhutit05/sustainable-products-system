import './App.css'

import { Routes, Route } from 'react-router-dom'
import CustomerLayout from './layouts/CustomerLayout'
import AdminLayout from './layouts/AdminLayout'

function App() {
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
