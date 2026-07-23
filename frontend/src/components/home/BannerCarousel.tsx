import { useEffect, useState } from 'react'
import { Carousel } from 'antd'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { BannerResponse } from '../../model/banner.model'
import { getActiveBanners } from '../../services/admin-banner.service'

export default function BannerCarousel() {
  const navigate = useNavigate()
  const [banners, setBanners] = useState<BannerResponse[]>([])

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await getActiveBanners()
        setBanners(data)
      } catch {
        // silent fail - banner is optional
      }
    }
    fetchBanners()
  }, [])

  if (banners.length === 0) return null

  return (
    <section className="banner_carousel max-w-7xl mx-auto mt-8 px-4">
      <Carousel
        autoplay
        dots
        autoplaySpeed={5000}
        effect="fade"
        className="rounded-2xl overflow-hidden"
      >
        {banners.map((banner) => (
          <div key={banner.bannerId}>
            <div
              className="relative h-[300px] sm:h-[400px] bg-cover bg-center flex items-center"
              style={{ backgroundImage: `url(${banner.imageUrl})` }}
            >
              <div className="absolute inset-0 bg-black/40" />
              <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 w-full">
                {banner.subtitle && (
                  <p className="text-sm sm:text-base text-emerald-300 font-medium mb-2">
                    {banner.subtitle}
                  </p>
                )}
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
                  {banner.title}
                </h2>
                {banner.content && (
                  <p className="text-sm sm:text-base text-white/80 mb-4 max-w-xl">
                    {banner.content}
                  </p>
                )}
                {banner.buttonText && banner.buttonLink && (
                  <button
                    onClick={() => navigate(banner.buttonLink)}
                    className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold px-5 py-2.5 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors cursor-pointer"
                  >
                    {banner.buttonText}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </section>
  )
}
