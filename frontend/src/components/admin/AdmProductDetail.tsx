import { Leaf, X } from 'lucide-react'
import type { Material, ProductRequest, ProductResponse } from '../../model/product.model'
import { useEffect, useState } from 'react'
import { useNotification } from '../../context/useNotification'
import Loading from '../Loading'
import { useCustomer } from '../../context/useCustomer'

interface ProductDetailProps {
  product: ProductResponse
  setIsModalOpen: (value: boolean) => void
  setShowProduct: (value: boolean) => void
}

export default function AdmProductDetail({
  product,
  setIsModalOpen,
  setShowProduct,
}: ProductDetailProps) {
  const [loading, setLoading] = useState(false)

  const { token } = useCustomer()

  const { showNotification } = useNotification()

  const [materials, setMaterials] = useState<Material[]>([])

  const CloseShowProduct = () => {
    setIsModalOpen(false)
    setShowProduct(false)
  }

  console.log('product', product)

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/materials', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await response.json()
        setMaterials(data)
      } catch (error) {
        console.error('Error fetching materials:', error)
      }
    }

    if (token) {
      fetchMaterials()
    }
  }, [token])

  return (
    <div className=" bg-white p-6 rounded-2xl shadow-lg max-h-150 overflow-y-scroll">
      <X
        className="absolute text-gray-400 hover:cursor-pointer hover:text-green-900 transition-colors top-4 right-4 cursor-pointer"
        size={24}
        onClick={CloseShowProduct}
      />
      <h2 className="text-xl font-semibold mb-4 uppercase text-green-900 text-center">
        Chi tiết sản phẩm
      </h2>

      <main className="mt grid grid-cols-2 gap-2">
        <h2 className="text-green-900 text-lg font-bold py-2 border-b border-gray-200 col-span-2">
          Hình ảnh sản phẩm
        </h2>
        <div className="flex justify-evenly items-center col-span-2">
          {product.imageUrls && product.imageUrls.length > 0 ? (
            product.imageUrls.map((imageUrl, index) => (
              <img
                key={index}
                src={imageUrl}
                alt={`Hình ảnh sản phẩm ${index + 1}`}
                className="w-48 h-32 object-cover rounded-lg mr-2 shadow-md hover:scale-105 transition-transform"
              />
            ))
          ) : (
            <p className="text-gray-500">Không có hình ảnh sản phẩm</p>
          )}
        </div>
        <h2 className="text-green-900 text-lg font-bold py-2 border-b border-gray-200 col-span-2">
          Thông tin sản phẩm
        </h2>
        <div className="">
          {/* TEN SAN PHAM */}
          <label className="block text-lg font-semibold text-green-900 py-2">
            Tên sản phẩm:
            <span className="text-md text-gray-600 font-medium ml-3">{product.productName}</span>
          </label>
          {/* GIA SAN PHAM */}
          <label className="block text-lg font-semibold text-green-900 py-2">
            Giá sản phẩm:
            <span className="text-md text-gray-600 font-medium ml-3">
              {product.productPrice} VND
            </span>
          </label>
          {/* NGUYEN LIEU */}
          <label className="block text-lg font-semibold text-green-900 py-2">
            Nguyên liệu:
            <span className="block text-md text-gray-600 font-medium ml-3">
              {product.materials.length === 0 ? 'Không có nguyên liệu' : ''}
              {product.materials.map((material, index) => (
                <p key={material.materialId}>
                  {index + 1}. {material.materialName} - {material.percentage}%
                </p>
              ))}
            </span>
          </label>

          {/* NGUON GOC */}
          <label className="block text-lg font-semibold text-green-900 py-2">
            Nguồn gốc:
            <span className="text-md text-gray-600 font-medium ml-3">
              {product.original ? product.original : 'Không có nguồn gốc'}
            </span>
          </label>

          {/* HET HAN */}
          <label className="block text-lg font-semibold text-green-900 py-2">
            Ngày hết hạn:
            <span className="text-md text-gray-600 font-medium ml-3">
              {product.expiredAt ? product.expiredAt : 'Không có ngày hết hạn'}
            </span>
          </label>
        </div>
        <div>
          {/* LOAI SAN PHAM */}
          <label className="block text-lg font-semibold text-green-900 py-2">
            Loại sản phẩm:
            <span className="text-md text-gray-600 font-medium ml-3">
              {product.categoryName ? product.categoryName : 'Không có loại sản phẩm'}
            </span>
          </label>

          {/* CHI SO CARBON */}

          <label className="block text-lg font-semibold text-green-900 py-2">
            Chỉ số carbon:
            <span className="text-md text-gray-600 font-medium mx-3">
              {product.productCarbonIndex ? product.productCarbonIndex : 'Không có chỉ số carbon'}
            </span>
            kg CO2e
          </label>

          {/* DIEM CARBON BAN DAU */}
          <label className="block text-lg font-semibold text-green-900 py-2">
            Điểm carbon ban đầu:
            <span className="text-md text-gray-600 font-medium ml-3">
              {product.baseEcoPoints ? product.baseEcoPoints : 'Không có điểm carbon ban đầu'}
              <Leaf className="inline-block ml-1 text-emerald-400" size={16} />
            </span>
          </label>

          {/* KHOI LUONG */}
          <label className="block text-lg font-semibold text-green-900 py-2">
            Khối lượng:
            <span className="text-md text-gray-600 font-medium ml-3">
              {product.weight ? product.weight : 'Không có khối lượng'}
            </span>
            kg
          </label>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            className="bg-white text-red-500 px-4 py-2 hover:cursor-pointer rounded-xl border border-red-500 hover:bg-red-500 hover:text-white transition-colors mr-2"
            onClick={() => CloseShowProduct()}
          >
            Đóng
          </button>
        </div>
      </main>

      {loading && <Loading message="Đang thêm sản phẩm. Vui lòng chờ trong giây lát !" />}
    </div>
  )
}
