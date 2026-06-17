import { useState } from 'react'
import type { UserRegister } from '../model/userRegister'

export default function Signup() {
  const [formData, setFormData] = useState<UserRegister>()

  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [numberphone, setNumberPhone] = useState<string>('')
  const [nationalId, setNationalId] = useState<string>('')

  const clear = () => {
    setUsername('')
    setPassword('')
    setConfirmPassword('')
    setEmail('')
    setNumberPhone('')
    setNationalId('')
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert('Mật khẩu và xác nhận mật khẩu không khớp!')
      return
    }

    setFormData({
      username: username,
      password: password,
      email: email,
      numberphone: numberphone,
      nationalId: nationalId,
    })

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
            <h2 className="signup-form--title text-2xl font-bold text-green-900 mb-6">Đăng ký</h2>
            <div className="signup_google rounded-2xl bg-white p-2.5 mb-2 flex justify-center items-center cursor-pointer hover:shadow-lg transition-shadow duration-300 hover:scale-101 border border-green-200">
              <button className="signup_google-btn flex items-center gap-2 text-green-900 ">
                <img src="/google.svg" alt="" className="signup_google-icon h-6 w-6" />
                Đăng ký với Google
              </button>
            </div>
            <p className="text-sm text-green-900">or</p>
            <form className="signup-form mt-4 text-left" onSubmit={handleSubmit}>
              <div className="gap-4 grid grid-cols-2">
                <div className="form-group ">
                  <label htmlFor="username" className="form-label my-2">
                    Tên người dùng:{' '}
                  </label>
                  <input
                    type="username"
                    id="username"
                    className="form-input text-md w-full bg-white border border-green-200 rounded-2xl p-2.5 placeholder:text-gray-400 text-green-900 focus:outline-none focus:border-green-800"
                    placeholder="Tên người dùng ..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="form-group ">
                  <label htmlFor="numberphone" className="form-label my-2">
                    Số điện thoại:{' '}
                  </label>
                  <input
                    type="numberphone"
                    id="numberphone"
                    className="form-input text-md w-full bg-white border border-green-200 rounded-2xl p-2.5 placeholder:text-gray-400 text-green-900 focus:outline-none focus:border-green-800"
                    placeholder="Số điện thoại ..."
                    value={numberphone}
                    onChange={(e) => setNumberPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group grid grid-cols-1 text-left">
                <label htmlFor="email" className="form-label">
                  Email:{' '}
                </label>
                <input
                  type="email"
                  id="email"
                  className="form-input text-md bg-white border border-green-200 rounded-2xl p-2.5 placeholder:text-gray-400 text-green-900 focus:outline-none focus:border-green-800"
                  placeholder="Nhập email của bạn ..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group grid grid-cols-1 text-left">
                <label htmlFor="nationalId" className="form-label">
                  Số CMND/CCCD:{' '}
                </label>
                <input
                  type="text"
                  id="nationalId"
                  className="form-input text-md bg-white border border-green-200 rounded-2xl p-2.5 placeholder:text-gray-400 text-green-900 focus:outline-none focus:border-green-800"
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value)}
                  placeholder="Nhập số CMND/CCCD ..."
                />
              </div>

              <div className="gap-4 grid grid-cols-2">
                <div className="form-group ">
                  <label htmlFor="password" className="form-label my-2">
                    Mật khẩu:{' '}
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="form-input text-md w-full bg-white border border-green-200 rounded-2xl p-2.5 placeholder:text-gray-400 text-green-900 focus:outline-none focus:border-green-800"
                    placeholder="Nhập mật khẩu ..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="form-group ">
                  <label htmlFor="confirmPassword" className="form-label my-2">
                    Nhập lại mật khẩu:{' '}
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className="form-input text-md w-full bg-white border border-green-200 rounded-2xl p-2.5 placeholder:text-gray-400 text-green-900 focus:outline-none focus:border-green-800"
                    placeholder="Nhập lại mật khẩu ..."
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
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
