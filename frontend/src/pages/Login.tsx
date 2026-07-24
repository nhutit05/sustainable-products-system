import { useState, useEffect, useCallback } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useNotification } from '../context/useNotification'

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string
            callback: (response: { credential: string }) => void
          }) => void
          renderButton: (
            element: HTMLElement,
            config: { theme: string; size: string; text: string }
          ) => void
        }
      }
    }
  }
}

interface FormErrors {
  username?: string
  password?: string
}

export default function Login() {
  const navigate = useNavigate()

  const [password, setPassword] = useState<string>('')
  const [username, setUsername] = useState<string>('')

  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<{ username: boolean; password: boolean }>({
    username: false,
    password: false,
  })

  const clear = () => {
    setPassword('')
    setUsername('')
    setErrors({})
    setTouched({ username: false, password: false })
  }

  const handleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  // Validate từng trường
  const validateField = (field: string, value: string): string | undefined => {
    switch (field) {
      case 'username':
        if (!value.trim()) return 'Tên đăng nhập không được để trống'
        if (value.trim().length < 3) return 'Tên đăng nhập phải có ít nhất 3 ký tự'
        return undefined
      case 'password':
        if (!value) return 'Mật khẩu không được để trống'
        if (value.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự'
        return undefined
      default:
        return undefined
    }
  }

  // Validate toàn bộ form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      username: validateField('username', username),
      password: validateField('password', password),
    }
    setErrors(newErrors)
    setTouched({ username: true, password: true })
    return !newErrors.username && !newErrors.password
  }

  // Xử lý thay đổi giá trị + validate real-time
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setUsername(value)
    if (touched.username) {
      setErrors((prev) => ({ ...prev, username: validateField('username', value) }))
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPassword(value)
    if (touched.password) {
      setErrors((prev) => ({ ...prev, password: validateField('password', value) }))
    }
  }

  // Xử lý blur để bắt đầu hiển thị lỗi
  const handleBlur = (field: 'username' | 'password') => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    const value = field === 'username' ? username : password
    setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) return

    const dataForm = {
      username: username,
      password: password,
    }

    const response = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: dataForm.username,
        password: dataForm.password,
      }),
    })

    const data = await response.json()
    if (response.ok) {
      localStorage.setItem('token', data.token)
      showNotification({
        message: 'Đăng nhập thành công',
        type: 'SUCCESS',
        duration: 3000,
      })
      if (data.role === 'ROLE_CUSTOMER') navigate('/')
      else if (data.role === 'ROLE_ADMIN') navigate('/admin')
    } else {
      if (data.code == 'USR_003') {
        showNotification({
          message: 'Mật khẩu không chính xác vui lòng thử lại',
          type: 'ERROR',
          duration: 3000,
        })
      } else if (data.code == 'USR_001') {
        showNotification({
          message: 'Tên đăng nhập không tồn tại vui lòng thử lại! Hoặc tạo tài khoản mới',
          type: 'ERROR',
          duration: 3000,
        })
      } else if (data.code == 'USR_010') {
        showNotification({
          message: 'Tài khoản đã bị khoá. Vui lòng liên hệ quản trị viên',
          type: 'ERROR',
          duration: 3000,
        })
      }
    }

    clear()
  }

  const contentSummary = [
    { content: 'kg CO₂ đã được tiết kiệm', value: '1M+' },
    { content: 'Lượng cây xanh được trồng', value: '12K+' },
    { content: 'Khách hàng tham gia', value: '50K+' },
    { content: 'Sản phẩm bán ra', value: '200K+' },
  ]

  // NOTIFICATION
  const { showNotification } = useNotification()

  const handleGoogleCredential = useCallback(
    async (response: { credential: string }) => {
      const res = await fetch('http://localhost:8080/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential }),
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem('token', data.token)
        showNotification({ message: 'Đăng nhập thành công', type: 'SUCCESS', duration: 3000 })
        if (data.role === 'ROLE_CUSTOMER') navigate('/')
        else if (data.role === 'ROLE_ADMIN') navigate('/admin')
      } else {
        showNotification({ message: 'Đăng nhập Google thất bại', type: 'ERROR', duration: 3000 })
      }
    },
    [navigate, showNotification]
  )

  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleCredential,
      })
      const btn = document.getElementById('google-login-btn-hidden')
      if (btn) {
        btn.innerHTML = ''
        window.google.accounts.id.renderButton(btn, {
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
        })
      }
    }
  }, [handleGoogleCredential])

  return (
    <>
      <div className="page-cus_signup">
        <aside className="signup-aside_left lg:flex flex-col justify-between p-12 mt-4">
          <div className="signup-aside_content relative z-10 text-left">
            <h2 className="text-4xl pb-4 font-bold leading-tight text-white ">
              Chào mừng bạn <br /> trở lại hành trình sống xanh.
            </h2>

            <p className="text-xl text-green-200/70 mt-4">
              Mỗi sản phẩm bạn chọn hôm nay là một phần rác thải được cứu khỏi bãi chôn lấp, góp
              phần gieo mầm cho một tương lai bền vững. ♻️
            </p>
          </div>

          <div className="signup-aside_summary grid grid-cols-2 gap-4">
            {contentSummary.map((item, index) => (
              <div
                key={index}
                className="signup-aside_summary-item text-left p-4 rounded-2xl bg-white/10 border border-white/15"
              >
                <h3 className="text-2xl font-bold text-white">{item.value}</h3>
                <p className="text-green-200/70 text-sm">{item.content}</p>
              </div>
            ))}
          </div>

          <div className="signup-aside_author">
            <p className="text-green-200/70 text-sm">
              &copy; 2026 ReGreenShop - Can Tho University. All rights reserved.
            </p>
          </div>
        </aside>

        <main className="signup-main_right flex-1 flex flex-col justify-center items-center p-12 w-full">
          <div className="max-w-md w-full">
            <h2 className="signup-form--title text-2xl font-bold text-green-900 mb-6">Đăng nhập</h2>
            <div className="relative mb-2 group cursor-pointer hover:shadow-lg transition-shadow duration-300 hover:scale-101 rounded-2xl border border-green-200">
              <div id="google-login-btn-hidden" className="w-full"></div>
              <div className="absolute inset-0 pointer-events-none flex justify-center items-center gap-2 rounded-2xl bg-white p-2.5">
                <svg width="20" height="20" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                <span className="text-md font-semibold text-green-900">Tiếp tục với Google</span>
              </div>
            </div>
            <p className="text-sm text-green-900">or</p>
            <form className="signup-form text-left" onSubmit={handleSubmit} noValidate>
              <div className="form-group grid grid-cols-1 text-left">
                <label htmlFor="username" className="form-label">
                  Tên đăng nhập:{' '}
                </label>
                <input
                  type="text"
                  id="username"
                  className={`form-input text-md bg-white border rounded-2xl p-2.5 placeholder:text-gray-400 text-green-900 focus:outline-none ${
                    touched.username && errors.username
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-green-200 focus:border-green-800'
                  }`}
                  placeholder="Nhập tên đăng nhập của bạn ..."
                  value={username}
                  onChange={handleUsernameChange}
                  onBlur={() => handleBlur('username')}
                />
                {touched.username && errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                )}
              </div>

              <div className="gap-4 grid grid-cols-1 text-left mt-4">
                <div className="form-group ">
                  <label htmlFor="password" className="form-label my-2">
                    Mật khẩu:{' '}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      className={`form-input text-md w-full bg-white border rounded-2xl p-2.5 placeholder:text-gray-400 text-green-900 focus:outline-none ${
                        touched.password && errors.password
                          ? 'border-red-400 focus:border-red-500'
                          : 'border-green-200 focus:border-green-800'
                      }`}
                      placeholder="Nhập mật khẩu ..."
                      value={password}
                      onChange={handlePasswordChange}
                      onBlur={() => handleBlur('password')}
                    />

                    {showPassword ? (
                      <Eye
                        className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                        onClick={handleShowPassword}
                      />
                    ) : (
                      <EyeOff
                        className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                        onClick={handleShowPassword}
                      />
                    )}
                  </div>
                  {touched.password && errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="signup-form--submit bg-primary text-md font-bold text-white rounded-2xl p-2.5 w-full mt-6 hover:scale-101 transition-transform duration-300 active:scale-100 active:shadow-none active:bg-primary/90"
              >
                Đăng nhập
              </button>
            </form>
          </div>
        </main>
      </div>
    </>
  )
}
