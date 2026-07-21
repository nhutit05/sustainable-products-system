import { CloudUploadOutlined, EditOutlined, PlusOutlined, MinusOutlined, InboxOutlined } from '@ant-design/icons'
import type {
  CategoryResponse,
  Material,
  ProductRequest,
  ProductResponse,
} from '../../model/product.model'
import { useEffect, useState } from 'react'
import {
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  DatePicker,
  Upload,
  Tag,
  Divider,
  Image,
  Spin,
  type UploadFile,
} from 'antd'
import { useNotification } from '../../context/useNotification'
import dayjs from 'dayjs'

interface EditProductProps {
  open: boolean
  onClose: () => void
  onSaved: (product: ProductResponse) => void
  categories: CategoryResponse[]
  selectedProduct: ProductResponse
}

export default function AdmEditProduct({
  open,
  onClose,
  onSaved,
  categories,
  selectedProduct,
}: EditProductProps) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [materials, setMaterials] = useState<Material[]>([])
  const [selectedMaterials, setSelectedMaterials] = useState<Material[]>([])
  const [percentages, setPercentages] = useState<Record<number, number>>({})
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [stockQuantity, setStockQuantity] = useState<number>(1)
  const [stockLoading, setStockLoading] = useState(false)
  const { showNotification } = useNotification()

  // Initialize form and materials when modal opens
  useEffect(() => {
    if (!open || !selectedProduct) return
    setSelectedMaterials(
      selectedProduct.materials.map((m) => ({
        materialId: m.materialId,
        materialName: m.materialName,
      }))
    )
    const pMap: Record<number, number> = {}
    selectedProduct.materials.forEach((m) => {
      pMap[m.materialId] = m.percentage
    })
    setPercentages(pMap)
    form.setFieldsValue({
      productName: selectedProduct.productName,
      productPrice: selectedProduct.productPrice,
      productCarbonIndex: selectedProduct.productCarbonIndex,
      baseEcoPoints: selectedProduct.baseEcoPoints,
      inventory: selectedProduct.inventory,
      weight: selectedProduct.weight,
      original: selectedProduct.original,
      categoryId: selectedProduct.categoryId,
      statusSale: selectedProduct.statusSale,
      expiredAt: selectedProduct.expiredAt ? dayjs(selectedProduct.expiredAt) : null,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, selectedProduct])

  useEffect(() => {
    if (!open) return
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('http://localhost:8080/api/admin/materials', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        if (res.ok && !cancelled) setMaterials(await res.json())
      } catch (e) {
        console.error('Error fetching materials:', e)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [open])

  const handleAddMaterial = (materialId: number) => {
    const material = materials.find((m) => m.materialId === materialId)
    if (material && !selectedMaterials.find((m) => m.materialId === materialId)) {
      setSelectedMaterials((prev) => [...prev, material])
      setPercentages((prev) => ({ ...prev, [materialId]: 0 }))
    }
  }

  const handleRemoveMaterial = (materialId: number) => {
    setSelectedMaterials((prev) => prev.filter((m) => m.materialId !== materialId))
    setPercentages((prev) => {
      const next = { ...prev }
      delete next[materialId]
      return next
    })
  }

  const handleStockUpdate = async (type: 'in' | 'out') => {
    if (!stockQuantity || stockQuantity <= 0) {
      showNotification({ message: 'Vui lòng nhập số lượng hợp lệ', type: 'ERROR', duration: 3000 })
      return
    }

    const currentInventory = selectedProduct.inventory
    let newInventory: number

    if (type === 'in') {
      newInventory = currentInventory + stockQuantity
    } else {
      if (stockQuantity > currentInventory) {
        showNotification({ message: 'Số lượng trừ vượt quá tồn kho hiện tại', type: 'ERROR', duration: 3000 })
        return
      }
      newInventory = currentInventory - stockQuantity
    }

    try {
      setStockLoading(true)
      const formData = new FormData()
      const request = {
        ...selectedProduct,
        inventory: newInventory,
        materialIds: selectedProduct.materials.map((m) => m.materialId),
        percentageMaterialIds: selectedProduct.materials.map((m) => m.percentage),
      }
      formData.append(
        'request',
        new Blob([JSON.stringify(request)], { type: 'application/json' })
      )

      const res = await fetch(
        `http://localhost:8080/api/admin/products/${selectedProduct.productId}`,
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          body: formData,
        }
      )

      if (res.ok) {
        const updated: ProductResponse = await res.json()
        showNotification({
          message: type === 'in' ? 'Nhập kho thành công!' : 'Xuất kho thành công!',
          type: 'SUCCESS',
          duration: 3000,
        })
        setStockQuantity(1)
        onSaved(updated)
      } else {
        showNotification({
          message: type === 'in' ? 'Nhập kho thất bại!' : 'Xuất kho thất bại!',
          type: 'ERROR',
          duration: 3000,
        })
      }
    } catch {
      showNotification({
        message: 'Có lỗi xảy ra khi cập nhật kho',
        type: 'ERROR',
        duration: 3000,
      })
    } finally {
      setStockLoading(false)
    }
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const dataSubmit: ProductRequest = {
        productName: values.productName,
        productPrice: values.productPrice,
        productCarbonIndex: values.productCarbonIndex,
        baseEcoPoints: values.baseEcoPoints,
        inventory: values.inventory,
        weight: values.weight,
        original: values.original || '',
        expiredAt: values.expiredAt ? values.expiredAt.format('YYYY-MM-DD') : '',
        categoryId: values.categoryId,
        statusSale: values.statusSale ?? false,
        materialIds: selectedMaterials.map((m) => m.materialId),
        percentageMaterialIds: selectedMaterials.map((m) => percentages[m.materialId] || 0),
      }

      const formData = new FormData()
      formData.append(
        'request',
        new Blob([JSON.stringify(dataSubmit)], { type: 'application/json' })
      )
      fileList.forEach((file) => {
        if (file.originFileObj) formData.append('images', file.originFileObj as Blob)
      })

      setLoading(true)
      const res = await fetch(
        `http://localhost:8080/api/admin/products/${selectedProduct.productId}`,
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          body: formData,
        }
      )

      if (res.ok) {
        const updated: ProductResponse = await res.json()
        showNotification({
          message: 'Cập nhật sản phẩm thành công!',
          type: 'SUCCESS',
          duration: 3000,
        })
        onSaved(updated)
      } else {
        showNotification({ message: 'Cập nhật sản phẩm thất bại!', type: 'ERROR', duration: 3000 })
      }
    } catch {
      // validation errors
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title={
        <span className="flex items-center gap-2 text-lg font-semibold">
          <EditOutlined className="text-blue-500" />
          Chỉnh sửa sản phẩm
        </span>
      }
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Lưu thay đổi"
      cancelText="Huỷ"
      width={800}
      centered
      destroyOnHidden
      confirmLoading={loading}
    >
      <Spin spinning={loading}>
        {!selectedProduct ? null : (
          <>
            {/* Current images */}
            {selectedProduct.imageUrls && selectedProduct.imageUrls.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">
              Hình ảnh hiện tại
            </p>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {selectedProduct.imageUrls.map((url, i) => (
                <Image
                  key={i}
                  src={url}
                  alt={`Ảnh ${i + 1}`}
                  width={100}
                  height={70}
                  className="rounded-lg object-cover flex-shrink-0 ring-1 ring-gray-100"
                  preview={{ mask: 'Xem' }}
                />
              ))}
            </div>
          </div>
        )}

        <Form form={form} layout="vertical">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Form.Item
              name="productName"
              label="Tên sản phẩm"
              rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="categoryId"
              label="Loại sản phẩm"
              rules={[{ required: true, message: 'Vui lòng chọn loại sản phẩm' }]}
            >
              <Select placeholder="Chọn loại sản phẩm">
                {categories.map((c) => (
                  <Select.Option key={c.categoryId} value={c.categoryId}>
                    {c.categoryName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="productPrice"
              label="Giá bán (VND)"
              rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
            >
              <InputNumber
                className="w-full"
                min={0}
                formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              />
            </Form.Item>

            <Form.Item
              name="inventory"
              hidden
            >
              <InputNumber />
            </Form.Item>

            <Form.Item name="productCarbonIndex" label="Chỉ số Carbon (kg CO₂e)">
              <InputNumber className="w-full" min={0} step={0.1} />
            </Form.Item>

            <Form.Item name="baseEcoPoints" label="Điểm Eco">
              <InputNumber className="w-full" min={0} />
            </Form.Item>

            <Form.Item name="weight" label="Khối lượng (kg)">
              <InputNumber className="w-full" min={0} step={0.1} />
            </Form.Item>

            <Form.Item name="statusSale" label="Trạng thái bán">
              <Select>
                <Select.Option value={true}>Đang bán</Select.Option>
                <Select.Option value={false}>Ngừng bán</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="original" label="Nguồn gốc" className="sm:col-span-2">
              <Input />
            </Form.Item>

            <Form.Item name="expiredAt" label="Ngày hết hạn" className="sm:col-span-2">
              <DatePicker className="w-full" format="YYYY-MM-DD" />
            </Form.Item>
          </div>

          {/* Materials */}
          <Divider titlePlacement="left" orientationMargin={0} className="!text-sm !font-semibold">
            Nguyên liệu
          </Divider>
          <div className="flex flex-wrap gap-2 mb-3">
            {selectedMaterials.map((m) => (
              <Tag
                key={m.materialId}
                closable
                onClose={() => handleRemoveMaterial(m.materialId)}
                color="blue"
                className="flex items-center gap-1 py-1 px-2"
              >
                <span>{m.materialName}</span>
                <InputNumber
                  size="small"
                  min={0}
                  max={100}
                  value={percentages[m.materialId] || 0}
                  onChange={(v) => setPercentages((prev) => ({ ...prev, [m.materialId]: v || 0 }))}
                  className="!w-16"
                  addonAfter="%"
                />
              </Tag>
            ))}
          </div>
          <Select
            placeholder="Thêm nguyên liệu..."
            className="w-full sm:w-64"
            onChange={handleAddMaterial}
            value={undefined}
          >
            {materials
              .filter((m) => !selectedMaterials.find((s) => s.materialId === m.materialId))
              .map((m) => (
                <Select.Option key={m.materialId} value={m.materialId}>
                  {m.materialName}
                </Select.Option>
              ))}
          </Select>

          {/* Stock Management */}
          <Divider titlePlacement="left" orientationMargin={0} className="!text-sm !font-semibold">
            <span className="flex items-center gap-1.5">
              <InboxOutlined className="text-blue-500" />
              Quản lý kho
            </span>
          </Divider>
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-600">Tồn kho hiện tại:</span>
              <span className={`text-lg font-bold ${selectedProduct.inventory <= 10 ? 'text-red-500' : 'text-emerald-600'}`}>
                {selectedProduct.inventory}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <InputNumber
                className="flex-1"
                min={1}
                value={stockQuantity}
                onChange={(v) => setStockQuantity(v || 1)}
                placeholder="Số lượng"
                disabled={stockLoading}
              />
              <button
                type="button"
                onClick={() => handleStockUpdate('in')}
                disabled={stockLoading}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 active:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <PlusOutlined className="text-xs" />
                Nhập kho
              </button>
              <button
                type="button"
                onClick={() => handleStockUpdate('out')}
                disabled={stockLoading}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 active:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <MinusOutlined className="text-xs" />
                Trừ kho
              </button>
            </div>
          </div>

          {/* Upload new images */}
          <Divider titlePlacement="left" orientationMargin={0} className="!text-sm !font-semibold">
            Thêm hình ảnh mới
          </Divider>
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={({ fileList: newList }) => setFileList(newList)}
            beforeUpload={() => false}
            multiple
            accept="image/*"
          >
            {fileList.length >= 8 ? null : (
              <div>
                <CloudUploadOutlined />
                <div className="mt-1 text-xs">Tải ảnh lên</div>
              </div>
            )}
          </Upload>
        </Form>
          </>
        )}
      </Spin>
    </Modal>
  )
}
