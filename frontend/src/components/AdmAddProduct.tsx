import { CloudUpload, X } from 'lucide-react'
import type { CategoryResponse, ProductRequest } from '../model/product.model'
import { useState } from 'react'

interface AddProductProps {
  setIsModalOpen: (value: boolean) => void
  setShowAddProduct: (value: boolean) => void
  categories: CategoryResponse[]
}

export default function AdmAddProduct({
  setIsModalOpen,
  setShowAddProduct,
  categories,
}: AddProductProps) {
  const [productRequest, setProductRequest] = useState<ProductRequest>({
    productName: '',
    productPrice: 0,
    productCarbonIndex: 0,
    baseEcoPoints: 0,
    inventory: 0,
    original: '',
    statusSale: false,
    expiredAt: '',
    weight: 0,
    categoryId: 0,
    fileId: 0,
  })

  const CloseAddProduct = () => {
    setIsModalOpen(false)
    setShowAddProduct(false)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    console.log('Form submitted')
  }

  return (
    <div className=" bg-white p-6 rounded-2xl shadow-lg">
      <X
        className="absolute text-gray-400 hover:cursor-pointer hover:text-gray-700 transition-colors top-4 right-4 cursor-pointer"
        size={24}
        onClick={CloseAddProduct}
      />
      <h2 className="text-xl font-semibold mb-4 uppercase text-green-900 text-center">
        Thêm sản phẩm mới
      </h2>
      <form className="mb-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-3 gap-4">
          <div className="form-group">
            <label htmlFor="productName" className="block font-semibold mb-1 text-green-900">
              Tên sản phẩm
            </label>
            <input
              type="text"
              id="productName"
              name="productName"
              value={productRequest?.productName}
              onChange={(e) =>
                setProductRequest((prev) => ({
                  ...prev,
                  productName: e.target.value,
                }))
              }
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="form-group">
            <label htmlFor="productPrice" className="block font-semibold mb-1 text-green-900">
              Giá sản phẩm
            </label>
            <input
              type="number"
              id="productPrice"
              name="productPrice"
              value={productRequest?.productPrice}
              onChange={(e) =>
                setProductRequest((prev) => ({
                  ...prev,
                  productPrice: Number(e.target.value),
                }))
              }
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="form-group">
            <label htmlFor="productCarbonIndex" className="block font-semibold mb-1 text-green-900">
              Chỉ số Carbon sản phẩm
            </label>
            <input
              type="number"
              id="productCarbonIndex"
              name="productCarbonIndex"
              value={productRequest?.productCarbonIndex}
              onChange={(e) =>
                setProductRequest((prev) => ({
                  ...prev,
                  productCarbonIndex: Number(e.target.value),
                }))
              }
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="form-group">
            <label htmlFor="productCategory" className="block font-semibold mb-1">
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

          <div className="form-group">
            <label htmlFor="productInventory" className="block font-semibold mb-1 text-green-900">
              Số lượng sản phẩm
            </label>
            <input
              type="number"
              id="productInventory"
              name="productInventory"
              value={productRequest?.inventory}
              onChange={(e) =>
                setProductRequest((prev) => ({
                  ...prev,
                  inventory: Number(e.target.value),
                }))
              }
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="form-group">
            <label htmlFor="weight" className="block font-semibold mb-1 text-green-900">
              Khối lượng sản phẩm (kg)
            </label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={productRequest?.weight}
              onChange={(e) =>
                setProductRequest((prev) => ({
                  ...prev,
                  weight: Number(e.target.value),
                }))
              }
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="form-group">
            <label htmlFor="original" className="block font-semibold mb-1 text-green-900">
              Nguồn gốc sản phẩm
            </label>
            <input
              type="number"
              id="original"
              name="original"
              value={productRequest?.original}
              onChange={(e) =>
                setProductRequest((prev) => ({
                  ...prev,
                  original: e.target.value,
                }))
              }
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="form-group">
            <label htmlFor="baseEcoPoints" className="block font-semibold mb-1 text-green-900">
              Chỉ số Eco sản phẩm
            </label>
            <input
              type="number"
              id="baseEcoPoints"
              name="baseEcoPoints"
              value={productRequest?.baseEcoPoints}
              onChange={(e) =>
                setProductRequest((prev) => ({
                  ...prev,
                  baseEcoPoints: Number(e.target.value),
                }))
              }
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="form-group">
            <label className="block font-semibold mb-1 text-green-900">Hình ảnh sản phẩm</label>
            <div
              onClick={() => {
                const fileInput = document.querySelector<HTMLInputElement>('#addProductImageUpload')
                if (fileInput) {
                  fileInput.click()
                }
              }}
              className="upload_area flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-4 cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <CloudUpload className="mx-auto text-gray-400" size={48} />
              <p className="text-center text-gray-500 mt-2">Chọn hình ảnh</p>
            </div>
            <input type="file" className="hidden" id="addProductImageUpload" />
          </div>
          <div className="uploadImage_review"></div>
        </div>
      </form>

      <div className="mt-4 flex justify-end">
        <button
          className="bg-white text-red-500 px-4 py-2 hover:cursor-pointer rounded-xl border border-red-500 hover:bg-red-500 hover:text-white transition-colors mr-2"
          onClick={() => CloseAddProduct()}
        >
          Đóng
        </button>

        <button
          className="bg-blue-500 text-white px-4 py-2 hover:cursor-pointer rounded-xl hover:bg-blue-600"
          onClick={() => handleSubmit}
        >
          Lưu sản phẩm
        </button>
      </div>
    </div>
  )
}
