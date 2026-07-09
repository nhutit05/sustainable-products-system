import { CloudUpload, X } from 'lucide-react'
import type {
  CategoryResponse,
  Material,
  ProductRequest,
  ProductResponse,
} from '../model/product.model'
import { useEffect, useState } from 'react'
import AddProductReviewImage from './AddProductReviewImage'
import { useNotification } from '../context/useNotification'
import Loading from './Loading'
import { useNavigate } from 'react-router-dom'

interface EditProductProps {
  setIsModalOpen: (value: boolean) => void
  setShowEditProduct: (value: boolean) => void
  categories: CategoryResponse[]
  selectedProduct: ProductResponse
}

export default function AdmEditProduct({
  setIsModalOpen,
  setShowEditProduct,
  categories,
  selectedProduct,
}: EditProductProps) {
  const [productRequest, setProductRequest] = useState<ProductRequest>({
    baseEcoPoints: selectedProduct.baseEcoPoints,
    materialIds: selectedProduct.materials.map((material) => material.materialId),
    original: selectedProduct.original,
    productCarbonIndex: selectedProduct.productCarbonIndex,
    percentageMaterialIds: selectedProduct.materials.map((material) => material.percentage),
    expiredAt: selectedProduct.expiredAt,
    weight: selectedProduct.weight,
    categoryId: selectedProduct.categoryId,
    statusSale: selectedProduct.statusSale,
    productName: selectedProduct.productName,
    productPrice: selectedProduct.productPrice,
    inventory: selectedProduct.inventory,
  })

  const [loading, setLoading] = useState(false)

  const { showNotification } = useNotification()

  const [materials, setMaterials] = useState<Material[]>([])

  const [selectedMaterials, setSelectedMaterials] = useState<Material[]>([])
  const [percentages, setPercentages] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]) // Assuming a maximum of 10 materials for simplicity
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])

  useEffect(() => {
    return () => {
      imagePreviewUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [imagePreviewUrls])

  const navigate = useNavigate()

  // Fetch materials
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/admin/materials', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        if (response.ok) {
          setMaterials(await response.json())
        }
      } catch (error) {
        console.error('Error fetching materials:', error)
      }
    }

    fetchMaterials()
  }, [])

  const CloseEditProduct = () => {
    setIsModalOpen(false)
    setShowEditProduct(false)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const dataSubmit: ProductRequest = {
      ...productRequest,
      materialIds: selectedMaterials.map((material) => material.materialId),
      percentageMaterialIds: percentages.slice(0, selectedMaterials.length),
    }

    const formData = new FormData()

    formData.append('request', new Blob([JSON.stringify(dataSubmit)], { type: 'application/json' }))

    imageFiles.forEach((file) => {
      formData.append('images', file)
    })

    setLoading(true)

    try {
      const response = await fetch(
        `http://localhost:8080/api/admin/products/${selectedProduct.productId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: formData,
        }
      )

      if (response.ok) {
        showNotification({
          message: 'Chỉnh sửa sản phẩm thành công!',
          type: 'SUCCESS',
          duration: 3000,
        })
        setTimeout(() => {
          CloseEditProduct()
          navigate(0) // Refresh the page after 3 seconds
        }, 3000)
      }
    } catch (error) {
      showNotification({
        message: 'Chỉnh sửa sản phẩm thất bại!',
        type: 'ERROR',
        duration: 3000,
      })
      console.error('Error submitting form:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])

    setImageFiles(files)

    setImagePreviewUrls((previousUrls) => {
      previousUrls.forEach((url) => URL.revokeObjectURL(url))
      return files.map((file) => URL.createObjectURL(file))
    })
  }

  return (
    <div className=" bg-white p-6 rounded-2xl shadow-lg max-h-150 overflow-y-scroll">
      <X
        className="absolute text-gray-400 hover:cursor-pointer hover:text-gray-700 transition-colors top-4 right-4 cursor-pointer"
        size={24}
        onClick={CloseEditProduct}
      />
      <h2 className="text-xl font-semibold mb-4 uppercase text-green-900 text-center">
        Chỉnh sửa sản phẩm
      </h2>
      <form id="edit-product-form" className="mb-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-4 gap-4">
          {/* TEN SAN PHAM */}
          <div className="form-group col-span-2">
            <label htmlFor="productName" className="block font-semibold mb-1 text-green-900">
              Tên sản phẩm
            </label>
            <input
              type="text"
              id="productName"
              name="productName"
              value={productRequest?.productName}
              placeholder="Nhập tên sản phẩm"
              onChange={(e) =>
                setProductRequest((prev) => ({
                  ...prev,
                  productName: e.target.value,
                }))
              }
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* LOẠI SẢN PHẨM */}
          <div className="form-group col-span-2">
            <label htmlFor="productCategory" className="block font-semibold mb-1 text-green-900">
              Loại sản phẩm
            </label>
            <select
              id="productCategory"
              name="productCategory"
              value={productRequest?.categoryId}
              onChange={(e) =>
                setProductRequest((prev) => ({
                  ...prev,
                  categoryId: Number(e.target.value),
                }))
              }
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Chọn loại sản phẩm</option>
              {categories.map((category) => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div>
          {/* GIA SAN PHAM */}
          <div className="form-group">
            <label htmlFor="productPrice" className="block font-semibold mb-1 text-green-900">
              Giá sản phẩm
            </label>
            <input
              type="number"
              id="productPrice"
              name="productPrice"
              value={productRequest?.productPrice}
              placeholder="vd: 1000.00 VND"
              onChange={(e) =>
                setProductRequest((prev) => ({
                  ...prev,
                  productPrice: e.target.value === '' ? 0 : Number(e.target.value),
                }))
              }
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* CHI SO CARBON */}
          <div className="form-group">
            <label htmlFor="productCarbonIndex" className="block font-semibold mb-1 text-green-900">
              Chỉ số Carbon sản phẩm
            </label>
            <input
              type="number"
              id="productCarbonIndex"
              name="productCarbonIndex"
              value={productRequest?.productCarbonIndex}
              placeholder="vd: 50 carbon index"
              onChange={(e) =>
                setProductRequest((prev) => ({
                  ...prev,
                  productCarbonIndex: e.target.value === '' ? 0 : Number(e.target.value),
                }))
              }
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* TRANG THÁI BÁN */}
          <div className="form-group">
            <label htmlFor="statusSale" className="block font-semibold mb-1">
              Trạng thái bán
            </label>
            <select
              id="statusSale"
              name="statusSale"
              value={productRequest?.statusSale ? 'true' : 'false'}
              onChange={(e) =>
                setProductRequest((prev) => ({
                  ...prev,
                  statusSale: e.target.value === 'true',
                }))
              }
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Chọn trạng thái</option>
              <option value="true">Đang bán</option>
              <option value="false">Ngừng bán</option>
            </select>
          </div>

          {/* SỐ LƯỢNG SẢN PHẨM */}
          <div className="form-group">
            <label htmlFor="productInventory" className="block font-semibold mb-1 text-green-900">
              Số lượng sản phẩm
            </label>
            <input
              type="number"
              id="productInventory"
              name="productInventory"
              value={productRequest?.inventory}
              placeholder="vd: 100"
              onChange={(e) =>
                setProductRequest((prev) => ({
                  ...prev,
                  inventory: e.target.value === '' ? 0 : Number(e.target.value),
                }))
              }
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* KHỐI LƯỢNG */}
          <div className="form-group">
            <label htmlFor="weight" className="block font-semibold mb-1 text-green-900">
              Khối lượng sản phẩm (kg)
            </label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={productRequest?.weight}
              placeholder="vd: 1.5kg"
              onChange={(e) =>
                setProductRequest((prev) => ({
                  ...prev,
                  weight: e.target.value === '' ? 0 : Number(e.target.value),
                }))
              }
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* NGUỒN GỐC */}
          <div className="form-group">
            <label htmlFor="original" className="block font-semibold mb-1 text-green-900">
              Nguồn gốc sản phẩm
            </label>
            <input
              type="text"
              id="original"
              name="original"
              value={productRequest?.original}
              placeholder="Ví dụ: Việt Nam"
              onChange={(e) =>
                setProductRequest((prev) => ({
                  ...prev,
                  original: e.target.value,
                }))
              }
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* CHỈ SỐ ECO */}
          <div className="form-group">
            <label htmlFor="baseEcoPoints" className="block font-semibold mb-1 text-green-900">
              Chỉ số Eco sản phẩm
            </label>
            <input
              type="number"
              id="baseEcoPoints"
              name="baseEcoPoints"
              value={productRequest?.baseEcoPoints}
              placeholder="vd: 100 eco points"
              onChange={(e) =>
                setProductRequest((prev) => ({
                  ...prev,
                  baseEcoPoints: e.target.value === '' ? 0 : Number(e.target.value),
                }))
              }
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* NGAY HET HAN */}
          <div className="form-group">
            <label htmlFor="expiryDate" className="block font-semibold mb-1 text-green-900">
              Ngày hết hạn
            </label>
            <input
              type="date"
              id="expiryDate"
              name="expiryDate"
              value={productRequest?.expiredAt}
              onChange={(e) =>
                setProductRequest((prev) => ({
                  ...prev,
                  expiredAt: e.target.value,
                }))
              }
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* NGUYEN LIEU */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="form-group">
            <label className="block font-semibold mb-1 text-green-900">Nguyên liệu sản phẩm</label>
            <select
              name="materials"
              id="materials"
              onChange={(e) => {
                const materialId = Number(e.target.value)
                const material = materials.find((m) => m.materialId === materialId)
                if (material) {
                  setSelectedMaterials((prev) => [...prev, material])
                }
              }}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Chọn nguyên liệu</option>
              {materials.map((material) => (
                <option key={material.materialId} value={material.materialId}>
                  {material.materialName}
                </option>
              ))}
            </select>
          </div>

          {/* HIEN THI NGUYEN LIEU DA CHON */}
          <div className="selected_materials">
            <label className="block font-semibold mb-1 text-green-900">Nguyên liệu đã chọn</label>
            <div className="selected_materials_list flex flex-wrap gap-2">
              {selectedMaterials.map((selected, index) => {
                const material = materials.find((m) => m.materialId === selected.materialId)
                if (!material) return null
                return (
                  <div className="grid grid-cols-3 gap-2">
                    <div
                      key={selected.materialId}
                      className="selected_material flex items-center justify-between gap-2 bg-gray-200 px-3 py-1 rounded-xl col-span-2"
                    >
                      <span>{material.materialName}</span>
                      <span></span>
                      <X
                        className="hover:cursor-pointer text-red-500"
                        size={16}
                        onClick={() =>
                          setSelectedMaterials((prev) =>
                            prev.filter((m) => m.materialId !== selected.materialId)
                          )
                        }
                      />
                    </div>
                    <div className="relative col-span-1">
                      <input
                        type="text"
                        placeholder="....  "
                        value={percentages[index] || ''}
                        onChange={(e) => {
                          const percentage = Number(e.target.value)
                          const newPercentages = [...percentages]
                          newPercentages[index] = percentage
                          setPercentages(newPercentages)
                        }}
                        className="w-full py-2 p-3 rounded-xl border border-gray-300 
                        focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                        %
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* HINH ANH SAN PHAM */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="col-span-2 mt-4">
            <label className="block font-semibold mb-1 text-green-900">
              Hình ảnh sản phẩm hiện tại
            </label>
            {selectedProduct.imageUrls && selectedProduct.imageUrls.length > 0 ? (
              <div className="flex justify-evenly items-center">
                {selectedProduct.imageUrls.map((imageUrl, index) => (
                  <img
                    key={index}
                    src={imageUrl}
                    alt={`Hình ảnh sản phẩm ${index + 1}`}
                    className="w-48 h-32 object-cover rounded-lg mr-2 shadow-md hover:scale-105 transition-transform"
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Không có hình ảnh sản phẩm</p>
            )}
          </div>
          <div className="form-group">
            <label className="block font-semibold mb-1 text-green-900">
              Thêm hình ảnh sản phẩm
            </label>
            <div
              onClick={() =>
                document.querySelector<HTMLInputElement>('#addProductImageUpload')?.click()
              }
              className="upload_area flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-4 cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <CloudUpload className="mx-auto text-gray-400" size={48} />
              <p className="text-center text-gray-500 mt-2">Chọn hình ảnh</p>
            </div>
            <input
              type="file"
              className="hidden"
              id="addProductImageUpload"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
          </div>

          <AddProductReviewImage imageFiles={imageFiles} imagePreviewUrls={imagePreviewUrls} />
        </div>
      </form>

      <div className="mt-4 flex justify-end">
        <button
          className="bg-white text-red-500 px-4 py-2 hover:cursor-pointer rounded-xl border border-red-500 hover:bg-red-500 hover:text-white transition-colors mr-2"
          onClick={() => CloseEditProduct()}
        >
          Đóng
        </button>

        <button
          className="bg-blue-500 text-white px-4 py-2 hover:cursor-pointer rounded-xl hover:bg-blue-600 hover:active:scale-98 transition-all"
          type="submit"
          form="edit-product-form"
        >
          Lưu sản phẩm
        </button>
      </div>

      {loading && <Loading message="Đang cập nhật sản phẩm. Vui lòng chờ trong giây lát !" />}
    </div>
  )
}
