import { CloudUploadOutlined, PlusOutlined } from '@ant-design/icons'
import type { CategoryResponse, Material, ProductRequest, ProductResponse } from '../../model/product.model'
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
  Spin,
  Divider,
  type UploadFile,
} from 'antd'
import { useNotification } from '../../context/useNotification'

interface AddProductProps {
  open: boolean
  onClose: () => void
  onSaved: (product: ProductResponse) => void
  categories: CategoryResponse[]
}

export default function AdmAddProduct({ open, onClose, onSaved, categories }: AddProductProps) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [materials, setMaterials] = useState<Material[]>([])
  const [selectedMaterials, setSelectedMaterials] = useState<Material[]>([])
  const [percentages, setPercentages] = useState<Record<number, number>>({})
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const { showNotification } = useNotification()

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

  const handleClose = () => {
    form.resetFields()
    setSelectedMaterials([])
    setPercentages({})
    setFileList([])
    onClose()
  }

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
      const res = await fetch('http://localhost:8080/api/admin/products', {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: formData,
      })

      if (res.ok) {
        const newProduct: ProductResponse = await res.json()
        showNotification({ message: 'Thêm sản phẩm thành công!', type: 'SUCCESS', duration: 3000 })
        onSaved(newProduct)
      } else {
        showNotification({ message: 'Thêm sản phẩm thất bại!', type: 'ERROR', duration: 3000 })
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
          <PlusOutlined className="text-emerald-500" />
          Thêm sản phẩm mới
        </span>
      }
      open={open}
      onCancel={handleClose}
      onOk={handleSubmit}
      okText="Thêm sản phẩm"
      cancelText="Huỷ"
      width={800}
      centered
      destroyOnClose
      confirmLoading={loading}
    >
      <Spin spinning={loading}>
        <Form form={form} layout="vertical" initialValues={{ statusSale: false }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Form.Item
              name="productName"
              label="Tên sản phẩm"
              rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
            >
              <Input placeholder="Nhập tên sản phẩm" />
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
                placeholder="VD: 150,000"
              />
            </Form.Item>

            <Form.Item
              name="inventory"
              label="Số lượng tồn kho"
              rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
            >
              <InputNumber className="w-full" min={0} placeholder="VD: 100" />
            </Form.Item>

            <Form.Item name="productCarbonIndex" label="Chỉ số Carbon (kg CO₂e)">
              <InputNumber className="w-full" min={0} step={0.1} placeholder="VD: 2.5" />
            </Form.Item>

            <Form.Item name="baseEcoPoints" label="Điểm Eco">
              <InputNumber className="w-full" min={0} placeholder="VD: 50" />
            </Form.Item>

            <Form.Item name="weight" label="Khối lượng (kg)">
              <InputNumber className="w-full" min={0} step={0.1} placeholder="VD: 1.5" />
            </Form.Item>

            <Form.Item name="statusSale" label="Trạng thái bán">
              <Select>
                <Select.Option value={true}>Đang bán</Select.Option>
                <Select.Option value={false}>Ngừng bán</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="original" label="Nguồn gốc" className="sm:col-span-2">
              <Input placeholder="VD: Việt Nam" />
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

          {/* Images */}
          <Divider titlePlacement="left" orientationMargin={0} className="!text-sm !font-semibold">
            Hình ảnh sản phẩm
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
      </Spin>
    </Modal>
  )
}
