import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()

  const [password, setPassword] = useState<string>('')
  const [username, setUsername] = useState<string>('')

  const [showPassword, setShowPassword] = useState<boolean>(false)

  const clear = () => {
    setPassword('')
    setUsername('')
  }

  const handleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const dataForm = {
      username: username,
      password: password,
    }

    console.log(JSON.stringify(dataForm))

    const response = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataForm),
    })

    const data = await response.json()
    if (response.ok) {
      localStorage.setItem('token', data.token)
      alert('Đăng nhập thành công')
      if (data.role === 'ROLE_CUSTOMER') navigate('/')
      else if (data.role === 'ROLE_ADMIN') navigate('/admin')
    } else {
      if (data.code == 'USR_003') {
        alert('Mật khẩu không chính xác vui lòng thử lại')
      } else if (data.code == 'USR_001') {
        alert('Tên đăng nhập không tồn tại vui lòng thử lại! Hoặc tạo tài khoản mới')
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

  return (
    <>
      <div className="page-cus_signup">
        <aside className="signup-aside_left lg:flex flex-col justify-between p-12 mt-5">
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

        <main className="signup-main_right flex-1 flex flex-col justify-center items-center p-12 w-full">
          <div className="max-w-md w-full">
            <h2 className="signup-form--title text-2xl font-bold text-green-900 mb-6">Đăng nhập</h2>
            <div className="signup_google rounded-2xl bg-white p-2.5 mb-2 flex justify-center items-center cursor-pointer hover:shadow-lg transition-shadow duration-300 hover:scale-101 border border-green-200">
              <button className="signup_google-btn flex items-center gap-2 text-green-900 ">
                <img src="/google.svg" alt="" className="signup_google-icon h-6 w-6" />
                Đăng nhập với Google
              </button>
            </div>
            <p className="text-sm text-green-900">or</p>
            <form className="signup-form text-left" onSubmit={handleSubmit}>
              <div className="form-group grid grid-cols-1 text-left">
                <label htmlFor="username" className="form-label">
                  Tên đăng nhập:{' '}
                </label>
                <input
                  type="text"
                  id="username"
                  className="form-input text-md bg-white border border-green-200 rounded-2xl p-2.5 placeholder:text-gray-400 text-green-900 focus:outline-none focus:border-green-800"
                  placeholder="Nhập tên đăng nhập của bạn ..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
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
                      className="form-input text-md w-full bg-white border border-green-200 rounded-2xl p-2.5 placeholder:text-gray-400 text-green-900 focus:outline-none focus:border-green-800"
                      placeholder="Nhập mật khẩu ..."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
