import { Leaf, Link, Mail, MapPin, Phone } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Footer() {
  const navigate = useNavigate()
  return (
    <footer className="bg-green-950 text-green-100 ">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          <div className="lg:col-span-2 text-left">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="navbar_logo p-2 rounded-2xl bg-primary shadow-md  hover:scale-105 transition-transform hover:cursor-pointer"
                onClick={() => navigate('/')}
              >
                <Leaf className="text-white" />
              </div>
              <span className="font-['Bricolage_Grotesque',sans-serif] text-xl font-extrabold text-white tracking-tight">
                Re<span className="text-emerald-500">Green</span>
              </span>
            </div>
            <p className="text-green-400/70 text-sm leading-relaxed mb-6 max-w-xs">
              {
                "Vietnam's most trusted marketplace for recycled and upcycled goods — built for the planet."
              }
            </p>
          </div>
          {[
            {
              title: 'Platform',
              links: [
                { l: 'Products', to: '/products' },
                { l: 'Community', to: '/community' },
                { l: 'About Us', to: '/about' },
                { l: 'Contact', to: '/contact' },
              ],
            },
            {
              title: 'Account',
              links: [
                { l: 'My Account', to: '/profile' },
                { l: 'My Orders', to: '/profile/orders' },
                { l: 'My Address', to: '/profile/addresses' },
                { l: 'Login', to: '/login' },
                { l: 'Register', to: '/register' },
              ],
            },
          ].map((col) => (
            <div key={col.title} className="text-sm text-left">
              <p className="text-white font-semibold text-sm mb-4">{col.title}</p>
              {col.links.map((item) => (
                <div
                  key={item.l}
                  className="block text-sm text-green-400/70 hover:text-emerald-300 mb-2.5 transition-colors"
                >
                  {item.l}
                </div>
              ))}
            </div>
          ))}
          <div>
            <p className="text-white font-semibold text-sm mb-4 text-left">Contact</p>
            {[
              { Icon: Mail, text: 'regreen@ctu.edu.vn' },
              { Icon: Phone, text: '+84 123 456 789' },
              { Icon: MapPin, text: 'Can Tho City, Vietnam' },
            ].map((c) => (
              <div
                key={c.text}
                className="flex items-center gap-2 text-sm text-green-400/70 mb-2.5"
              >
                <c.Icon className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{c.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-green-800/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-green-500/60 text-sm">
            © 2026 ReGreenShop - Can Tho University · Built with 💚 for the planet.
          </p>
          <div className="flex items-center gap-2 text-xs text-green-500/50">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            2.4M kg CO₂ saved and counting
          </div>
        </div>
      </div>
    </footer>
  )
}
