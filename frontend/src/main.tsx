import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { NotificationProvider } from './context/NotificationContext.tsx'
import { NotificationBellProvider } from './context/NotificationBellContext.tsx'
import { CustomerProvider } from './context/CustomerContext.tsx'
import { ConfigProvider } from 'antd'
import { CartProvider } from './context/CartContext.tsx'

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <CustomerProvider>
    <BrowserRouter>
      <NotificationProvider>
        <NotificationBellProvider>
          <ConfigProvider
            theme={{
              token: {
                fontFamily: '"Bricolage Grotesque", sans-serif',
              },
            }}
          >
            <CartProvider>
              <App />
            </CartProvider>
          </ConfigProvider>
        </NotificationBellProvider>
      </NotificationProvider>
    </BrowserRouter>
  </CustomerProvider>
  // </StrictMode>
)
