import {
  ArrowRight,
  Award,
  Calculator,
  CheckCircle,
  Heart,
  BarChart3,
  Recycle,
  TrendingUp,
  Wind,
  Leaf,
  Sprout,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { ProductIntroduce, ProductDetail, ProductImage } from '../model/product.model'
import ProductCard from '../components/ProductCard'

export default function Homepage() {
  const navigate = useNavigate()

  const [products, setProducts] = useState<ProductIntroduce[]>([])

  useEffect(() => {
    const fetchImageProduct = async (productId: number) => {
      try {
        const reponse = await fetch(`http://localhost:8080/api/products/${productId}/images`)
        if (reponse.ok) {
          const imageData = await reponse.json()
          imageData.sort((a: ProductImage, b: ProductImage) => a.productImageId - b.productImageId)
          if (imageData && imageData.length > 0) {
            return imageData[0].imageUrl
          }
        }
      } catch (error) {
        console.error(`Error fetching image for product ${productId}:`, error)
      }
    }

    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/products?page=1&limit=4')

        if (response.ok) {
          const data = await response.json()
          const filteredProducts: ProductIntroduce[] = await Promise.all(
            data.map(async (product: ProductDetail) => {
              const imageUrl = await fetchImageProduct(product.productId)
              return { ...product, productImage: imageUrl }
            })
          )
          setProducts(filteredProducts)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }

    fetchProducts()
  }, [])

  const home_summary = [
    {
      label: 'kg CO2 Saved',
      value: '550 kg',
      icon: <Wind className="w-5 h-5 text-white" />,
    },
    {
      label: 'Recycle Products',
      value: '20K+',
      icon: <Recycle className="w-5 h-5 text-white" />,
    },
    {
      label: 'Satisfied Customers',
      value: '50K+',
      icon: <Heart className="w-5 h-5 text-white" />,
    },
    {
      label: 'Eco-Friendly Products',
      value: '100+',
      icon: <CheckCircle className="w-5 h-5 text-white" />,
    },
  ]

  return (
    <>
      <div className="page-cus_homepage mt-12">
        {/* Section 1: home banner */}
        <section id="home" className="homepage_banner min-h-screen p-4 relative overflow-hidden">
          {/* Custom 2 diem sang */}
          <div className="absolute top-20 -left-50 w-125 h-125 rounded-full bg-emerald-200/40 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-20 right-0 w-100 h-100 rounded-full bg-teal-200/50 blur-[80px] pointer-events-none" />

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
                <a
                  href="#products"
                  className="inline-flex items-center gap-2 text-lg font-semibold px-6 py-3 shadow-lg text-white rounded-2xl bg-linear-to-r from-emerald-400 to-teal-600 hover:scale-105 hover:cursor-pointer transition-all duration-300"
                >
                  Khám phá ngay <ArrowRight className="inline-block w-5 h-5 ml-2" />
                </a>

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
        {/* Section 2:  Summary*/}
        <section
          id="summary"
          className="homepage_summary mt-8 p-4 grid grid-cols-4 gap-8 items-center max-w-7xl mx-auto"
        >
          {home_summary.map((itemSummary, index) => (
            <div
              className="item_summary text-left bg-linear-to-br from-[#F8FFF4] to-[#E8F5E9] border border-green-100 rounded-2xl p-6 flex flex-col gap-2"
              key={index}
            >
              <div className="summary_icon_wrapper relative">
                <div className="bg-linear-to-br from-emerald-400 to-teal-500 p-3 rounded-xl h-12 w-12 flex items-center justify-center">
                  {itemSummary.icon}
                </div>
                <BarChart3 className="absolute -top-2 -right-2 w-5 h-5 text-green-300 animate-pulse" />
              </div>
              <div className="item_summary--content">
                <h2 className="text-md text-green-900">{itemSummary.label}</h2>
                <p className="text-2xl font-semibold text-emerald-600">{itemSummary.value}</p>
              </div>
            </div>
          ))}
        </section>
        {/* Section 3: Products */}
        <section
          id="products"
          className="homepage_products min-h-screen p-4 relative overflow-hidden text-left max-w-7xl mx-auto mt-20"
        >
          <header className="relative">
            <div className="">
              <h2 className="text-xl font-semibold text-emerald-400 p-3">MARKETPLACE</h2>
              <p className="text-4xl font-bold text-green-900">
                Hãy chọn cho mình{' '}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-teal-600 mx-2">
                  sản phẩm XANH♻️{' '}
                </span>
                <br />
                Phù hợp nhất!
              </p>
            </div>
            <p
              className="text-lg text-emerald-600 font-medium leading-relaxed absolute bottom-0 right-0 hover:text-emerald-400 hover:cursor-pointer transition-colors"
              onClick={() => navigate('/products')}
            >
              Xem tất cả <ArrowRight className="inline-block w-5 h-5 ml-2" />
            </p>
          </header>

          <main className="products_list mt-12">
            {products.length > 0 ? (
              <div className="products_list--grid grid grid-cols-4 gap-8">
                {products.map((product) => (
                  <ProductCard product={product} />
                ))}
              </div>
            ) : (
              <div className="products_empty text-center text-lg text-gray-500 w-full">
                Sản phẩm đang được cập nhật...
              </div>
            )}
          </main>
        </section>
      </div>
    </>
  )
}
