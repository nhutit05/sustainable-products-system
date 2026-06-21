import {
  ArrowRight,
  Award,
  Calculator,
  CheckCircle,
  Heart,
  Link,
  Recycle,
  TrendingUp,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Homepage() {
  const navigate = useNavigate()
  return (
    <>
      <div className="page-cus_homepage mt-12">
        <section id="home" className="homepage_banner min-h-screen p-4 relative overflow-hidden">
          {/* Custom 2 diem sang */}
          <div className="absolute top-20 left-[-200px] w-[500px] h-[500px] rounded-full bg-emerald-200/40 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-20 right-0 w-[400px] h-[400px] rounded-full bg-teal-200/50 blur-[80px] pointer-events-none" />

          {/* Tao image luoi */}
          <div
            className="absolute inset-0 opacity-[0.04] "
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, #2E7D32 0px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, #2E7D32 0px, transparent 1px, transparent 60px)',
            }}
          ></div>

          <div className="max-w-7xl mx-auto overflow-hidden px-6 pt-24 pb-16 grid grid-cols-2 gap-16 items-center">
            <aside className="homepage_banner_left text-left z-10">
              <div className="homepage_marker_title inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Khu mua sắm sản phẩm xanh số #1 tại Việt Nam
              </div>
              <h1 className="font-bold text-7xl text-green-900">
                Recycle.{' '}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-teal-600">
                  Reuse
                </span>
              </h1>
              <h1 className="font-bold text-7xl text-green-900">
                Re
                <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-teal-600">
                  Green{' '}
                </span>
                <span className="text-green-900">the World.</span>
              </h1>
              <p className="text-lg text-green-900/60 leading-relaxed my-6">
                Đã có hơn 50,000+ người dùng tin tưởng với sản phẩm eco thân thiện môi trường, cùng
                nhau góp phần bảo vệ hành tinh xanh của chúng ta. Một sản phẩm xanh - một hành động
                xanh ý nghĩa !
              </p>

              <div className="homepage_banner-explore flex items-center gap-4 flex-wrap w-full">
                <div
                  onClick={() => navigate('/products')}
                  className="inline-flex items-center gap-2 text-lg font-semibold px-6 py-3 shadow-lg text-white rounded-2xl bg-linear-to-r from-emerald-400 to-teal-600 hover:scale-105 hover:cursor-pointer transition-all duration-300"
                >
                  Khám phá ngay <ArrowRight className="inline-block w-5 h-5 ml-2" />
                </div>

                <div
                  onClick={() => navigate('/carbon-calculator')}
                  className=" inline-flex items-center gap-2 text-lg font-semibold px-6 py-3 shadow-lg  text-green-900 rounded-2xl bg-white hover:scale-105 hover:cursor-pointer transition-all duration-300"
                >
                  <Calculator className="inline-block w-5 h-5 ml-2" />
                  Tính chỉ số carbon
                </div>
              </div>
            </aside>
            <main className="home_banner_right relative hidden lg:block">
              <div className="home_banner_introduce aspect-square max-w-lg mx-auto">
                <div className="home_introduce rounded-4xl bg-white border-2 border-emerald-400 p-6 flex flex-col gap-4">
                  <img src="eco_friendly.jpg" alt="Eco Friendly" className="home_introduce-img" />
                </div>

                <div
                  className="home_introduce-recycle absolute top-0 left-0 bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg border border-green-100 flex items-center gap-4"
                  style={{ animation: 'heartBeat 1.5s infinite' }}
                >
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div className="home_introduce--content">
                    <p className="text-sm text-green-900">CO2 Saved Today</p>
                    <p className="text-lg font-semibold text-emerald-600">550 kg</p>
                  </div>
                </div>

                <div
                  className="home_introduce-recycle absolute bottom-0 right-0 bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg border border-green-100 flex items-center gap-4"
                  style={{ animation: 'heartBeat 1.5s infinite' }}
                >
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-lime-400 to-emerald-500 flex items-center justify-center">
                    <Recycle className="w-5 h-5 text-white" />
                  </div>
                  <div className="home_introduce--content">
                    <p className="text-sm text-green-900">Recycle Products</p>
                    <p className="text-lg font-semibold text-emerald-600">20K+</p>
                  </div>
                </div>
              </div>
            </main>
          </div>
          <div className="absolute -bottom-1 left-0 right-0">
            <svg viewBox="0 0 1440 80" fill="none" className="w-full">
              <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="white" />
            </svg>
          </div>
        </section>
        <section id="why-choose-us" className="homepage_why_choose_us min-h-screen p-4">
          <div className="max-w-7xl mx-auto overflow-hidden px-6 pt-24 pb-16 grid grid-cols-2 gap-16 items-center">
            <aside className="homepage_why_choose_us_left text-left z-10">
              <h2 className="font-bold text-5xl text-green-900 mb-6">Tại sao chọn chúng tôi?</h2>
              <p className="text-lg text-green-900/60 leading-relaxed my-6">
                Chúng tôi cam kết mang đến cho bạn những sản phẩm thân thiện với môi trường, giúp
                bạn giảm thiểu tác động tiêu cực đến hành tinh. Với hơn 50,000+ người dùng tin
                tưởng, chúng tôi tự hào là nơi mua sắm sản phẩm xanh số #1 tại Việt Nam.
              </p>
              <div
                className="homepage_why_choose_us-explore flex items-center gap-4 flex-wrap w-full
              "
              >
                <div
                  onClick={() => navigate('/products')}
                  className="inline-flex items-center gap-2 text-lg font-semibold px-6 py-3 shadow-lg text-white rounded-2xl bg-linear-to-r from-emerald-400 to-teal-600 hover:scale-105 hover:cursor-pointer transition-all duration-300"
                >
                  Khám phá ngay <ArrowRight className="inline-block w-5 h-5 ml-2" />
                </div>
                <div
                  onClick={() => navigate('/carbon-calculator')}
                  className=" inline-flex items-center gap-2 text-lg font-semibold px-6 py-3 shadow-lg  text-green-900 rounded-2xl bg-white hover:scale-105 hover:cursor-pointer transition-all duration-300"
                >
                  <Calculator className="inline-block w-5 h-5 ml-2" />
                  Tính chỉ số carbon
                </div>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </>
  )
}
