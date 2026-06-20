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

export default function Homepage() {
  return (
    <>
      <div className="page-cus_homepage ">
        <section id="home" className="homepage_banner min-h-screen mt-12 p-3">
          {/* Custom 2 diem sang */}
          <div className="absolute top-20 left-[-80px] w-[500px] h-[500px] rounded-full bg-emerald-200/40 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-20 right-[-60px] w-[400px] h-[400px] rounded-full bg-teal-200/50 blur-[80px] pointer-events-none" />

          {/* Tao image luoi */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, #2E7D32 0px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, #2E7D32 0px, transparent 1px, transparent 60px)',
            }}
          ></div>

          <aside className="homepage_banner_left ">
            <div className="homepage_marker_title inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Khu mua sắm sản phẩm xanh số #1 tại Việt Nam
            </div>
          </aside>
          <main className="home_banner_right"></main>
        </section>
      </div>
    </>
  )
}
