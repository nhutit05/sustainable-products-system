import { useState } from 'react'
import type { UserRegister } from '../model/userRegister.model'
import { useNavigate } from 'react-router-dom'

interface FormErrors {
  username?: string
  password?: string
  confirmPassword?: string
  email?: string
  numberPhone?: string
  nationalId?: string
}

export default function Signup() {
  const [formData, setFormData] = useState<UserRegister>()

  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [numberPhone, setNumberPhone] = useState<string>('')
  const [nationalId, setNationalId] = useState<string>('')

  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState({
    username: false,
    password: false,
    confirmPassword: false,
    email: false,
    numberPhone: false,
    nationalId: false,
  })

  const navigate = useNavigate()

  const clear = () => {
    setUsername('')
    setPassword('')
    setConfirmPassword('')
    setEmail('')
    setNumberPhone('')
    setNationalId('')
    setErrors({})
    setTouched({
      username: false,
      password: false,
      confirmPassword: false,
      email: false,
      numberPhone: false,
      nationalId: false,
    })
  }

  const validateField = (field: string, value: string): string | undefined => {
    switch (field) {
      case 'username':
        if (!value.trim()) return 'Tên đăng nhập không được để trống'
        if (value.trim().length < 3) return 'Tên đăng nhập phải có ít nhất 3 ký tự'
        return undefined
      case 'password':
        if (!value) return 'Mật khẩu không được để trống'
        if (value.length < 6)
          return 'Mật khẩu phải có ít nhất 6 ký tự, có ký tự viết hoa, viết thường và chữ số'
        return undefined
      case 'confirmPassword':
        if (!value) return 'Xác nhận mật khẩu không được để trống'
        if (value !== password) return 'Mật khẩu và xác nhận mật khẩu không khớp'
        return undefined
      case 'email':
        if (!value) return 'Email không được để trống'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Email không hợp lệ'
        return undefined
      case 'numberPhone':
        if (!value) return 'Số điện thoại không được để trống'
        if (!/^[0-9]{10}$/.test(value)) return 'Số điện thoại không hợp lệ'
        return undefined
      case 'nationalId':
        if (!value) return 'Số CMND/CCCD không được để trống'
        if (!/^[0-9]{9,12}$/.test(value)) return 'Số CMND/CCCD không hợp lệ'
        return undefined
      default:
        return undefined
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      username: validateField('username', username),
      password: validateField('password', password),
      confirmPassword: validateField('confirmPassword', confirmPassword),
      email: validateField('email', email),
      numberPhone: validateField('numberPhone', numberPhone),
      nationalId: validateField('nationalId', nationalId),
    }
    setErrors(newErrors)
    setTouched({
      username: true,
      password: true,
      confirmPassword: true,
      email: true,
      numberPhone: true,
      nationalId: true,
    })
    return Object.values(newErrors).every((error) => !error)
  }

  // Xử lý thay đổi giá trị + validate real-time
  const handleChange = (field: keyof FormErrors, value: string, setter: (v: string) => void) => {
    setter(value)
    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }))
    }
  }

  // Xử lý blur để bắt đầu hiển thị lỗi
  const handleBlur = (field: keyof FormErrors, value: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validateForm()) return

    setFormData({
      username: username,
      password: password,
      email: email,
      numberPhone: numberPhone,
      nationalId: nationalId,
    })

    const response = await fetch('http://localhost:8080/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
        email: email,
        numberPhone: numberPhone,
        nationalId: nationalId,
      }),
    })

    const data = await response.json()

    console.log('Response from server:', data)
    if (response.ok) {
      localStorage.setItem('token', data.token)
      alert('Đăng ký tài khoản thành công')
      if (data.role === 'ROLE_CUSTOMER') navigate('/')
      else if (data.role === 'ROLE_ADMIN') navigate('/admin')
    } else {
      if (data.code == 'USR_003') {
        alert('Mật khẩu không chính xác vui lòng thử lại')
      } else if (data.code == 'USR_001') {
        alert('Tên đăng nhập không tồn tại vui lòng thử lại! Hoặc tạo tài khoản mới')
      } else if (data.code == 'USR_004') {
        alert('Tên đăng nhập đã tồn tại vui lòng thử lại! Hoặc tạo tài khoản mới')
      }
    }

    // clear()
  }

  const contentSummary = [
    { content: 'kg CO₂ đã được tiết kiệm', value: '1M+' },
    { content: 'Lượng cây xanh được trồng', value: '12K+' },
    { content: 'Khách hàng tham gia', value: '50K+' },
    { content: 'Sản phẩm bán ra', value: '200K+' },
  ]

  return (
    <>
      <div className="page-cus_signup">
        <aside className="signup-aside_left lg:flex flex-col justify-between p-12">
          <div className="signup-aside_content relative z-10 text-left">
            <h2 className="text-4xl pb-4 font-bold leading-tight text-white ">
              Chào mừng bạn <br /> trở lại hành trình sống xanh.
            </h2>

            <p className="text-xl text-green-200/70 mt-4 mb-10">
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

        <main className="signup-main_right flex-1 flex flex-col justify-center items-center px-12 w-full">
          <div className="max-w-md w-full">
            <h2 className="signup-form--title text-2xl font-bold text-green-900 mb-6">Đăng ký</h2>
            <div className="signup_google rounded-2xl bg-white p-2.5 mb-2 flex justify-center items-center cursor-pointer hover:shadow-lg transition-shadow duration-300 hover:scale-101 border border-green-200">
              <button className="signup_google-btn flex items-center gap-2 text-green-900 ">
                <img src="/google.svg" alt="" className="signup_google-icon h-6 w-6" />
                Đăng ký với Google
              </button>
            </div>
            <p className="text-sm text-green-900">or</p>
            <form className="signup-form mt-4 text-left" onSubmit={handleSubmit} noValidate>
              <div className="gap-4 grid grid-cols-2">
                <div className="form-group ">
                  <label htmlFor="username" className="form-label my-2">
                    Tên người dùng:{' '}
                  </label>
                  <input
                    type="text"
                    id="username"
                    className={`form-input text-md w-full bg-white border rounded-2xl p-2.5 placeholder:text-gray-400 text-green-900 focus:outline-none ${
                      touched.username && errors.username
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-green-200 focus:border-green-800'
                    }`}
                    placeholder="Tên người dùng ..."
                    value={username}
                    onChange={(e) => handleChange('username', e.target.value, setUsername)}
                    onBlur={() => handleBlur('username', username)}
                  />
                  {touched.username && errors.username && (
                    <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                  )}
                </div>
                <div className="form-group ">
                  <label htmlFor="numberphone" className="form-label my-2">
                    Số điện thoại:{' '}
                  </label>
                  <input
                    type="tel"
                    id="numberphone"
                    className={`form-input text-md w-full bg-white border rounded-2xl p-2.5 placeholder:text-gray-400 text-green-900 focus:outline-none ${
                      touched.numberPhone && errors.numberPhone
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-green-200 focus:border-green-800'
                    }`}
                    placeholder="Số điện thoại ..."
                    value={numberPhone}
                    onChange={(e) => handleChange('numberPhone', e.target.value, setNumberPhone)}
                    onBlur={() => handleBlur('numberPhone', numberPhone)}
                  />
                  {touched.numberPhone && errors.numberPhone && (
                    <p className="text-red-500 text-xs mt-1">{errors.numberPhone}</p>
                  )}
                </div>
              </div>

              <div className="form-group grid grid-cols-1 text-left">
                <label htmlFor="email" className="form-label">
                  Email:{' '}
                </label>
                <input
                  type="email"
                  id="email"
                  className={`form-input text-md bg-white border rounded-2xl p-2.5 placeholder:text-gray-400 text-green-900 focus:outline-none ${
                    touched.email && errors.email
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-green-200 focus:border-green-800'
                  }`}
                  placeholder="Nhập email của bạn ..."
                  value={email}
                  onChange={(e) => handleChange('email', e.target.value, setEmail)}
                  onBlur={() => handleBlur('email', email)}
                />
                {touched.email && errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div className="form-group grid grid-cols-1 text-left">
                <label htmlFor="nationalId" className="form-label">
                  Số CMND/CCCD:{' '}
                </label>
                <input
                  type="text"
                  id="nationalId"
                  className={`form-input text-md bg-white border rounded-2xl p-2.5 placeholder:text-gray-400 text-green-900 focus:outline-none ${
                    touched.nationalId && errors.nationalId
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-green-200 focus:border-green-800'
                  }`}
                  value={nationalId}
                  onChange={(e) => handleChange('nationalId', e.target.value, setNationalId)}
                  onBlur={() => handleBlur('nationalId', nationalId)}
                  placeholder="Nhập số CMND/CCCD ..."
                />
                {touched.nationalId && errors.nationalId && (
                  <p className="text-red-500 text-xs mt-1">{errors.nationalId}</p>
                )}
              </div>

              <div className="gap-4 grid grid-cols-2">
                <div className="form-group ">
                  <label htmlFor="password" className="form-label my-2">
                    Mật khẩu:{' '}
                  </label>
                  <input
                    type="password"
                    id="password"
                    className={`form-input text-md w-full bg-white border rounded-2xl p-2.5 placeholder:text-gray-400 text-green-900 focus:outline-none ${
                      touched.password && errors.password
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-green-200 focus:border-green-800'
                    }`}
                    placeholder="Nhập mật khẩu ..."
                    value={password}
                    onChange={(e) => handleChange('password', e.target.value, setPassword)}
                    onBlur={() => handleBlur('password', password)}
                  />
                  {touched.password && errors.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                  )}
                </div>
                <div className="form-group ">
                  <label htmlFor="confirmPassword" className="form-label my-2">
                    Nhập lại mật khẩu:{' '}
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className={`form-input text-md w-full bg-white border rounded-2xl p-2.5 placeholder:text-gray-400 text-green-900 focus:outline-none ${
                      touched.confirmPassword && errors.confirmPassword
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-green-200 focus:border-green-800'
                    }`}
                    placeholder="Nhập lại mật khẩu ..."
                    value={confirmPassword}
                    onChange={(e) =>
                      handleChange('confirmPassword', e.target.value, setConfirmPassword)
                    }
                    onBlur={() => handleBlur('confirmPassword', confirmPassword)}
                  />
                  {touched.confirmPassword && errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              <div className="mt-3">
                <p className="text-sm text-green-900 flex items-center gap-2">
                  <input
                    id="terms"
                    type="checkbox"
                    className="w-4 h-4 mt-0.5 accent-emerald-500"
                    required
                  />
                  <label htmlFor="terms" className="text-sm font-bold text-green-900 mt-1">
                    Tôi đồng ý với các điều khoản và chính sách bảo mật.
                  </label>
                </p>
              </div>

              <button
                type="submit"
                className="signup-form--submit bg-primary text-md font-bold text-white rounded-2xl p-2.5 w-full mt-6 hover:scale-101 transition-transform duration-300 active:scale-100 active:shadow-none active:bg-primary/90"
              >
                Đăng ký
              </button>
            </form>
          </div>
        </main>
      </div>
    </>
  )
}
