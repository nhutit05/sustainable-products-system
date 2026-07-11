import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { NotificationProvider } from './context/NotificationContext.tsx'
import { CustomerProvider } from './context/CustomerContext.tsx'
import { ConfigProvider } from 'antd'

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <CustomerProvider>
    <BrowserRouter>
      <NotificationProvider>

        <ConfigProvider
          theme={{
            token: {
              fontFamily: '"Bricolage Grotesque", sans-serif',
            },
          }}
        >
          <App />
        </ConfigProvider>
      </NotificationProvider>
    </BrowserRouter>
  </CustomerProvider>
  // </StrictMode>
)
