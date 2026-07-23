import { useCallback, useEffect, useState, useRef } from 'react'
import {
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Switch,
  message,
  Popconfirm,
  Table,
  Tag,
  Space,
  Image,
  Upload,
} from 'antd'
import { Plus, Pencil, Trash2, Upload as UploadIcon } from 'lucide-react'
import type { BannerResponse } from '../model/banner.model'
import {
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} from '../services/admin-banner.service'

export default function AdminBanners() {
  const token = localStorage.getItem('token') ?? ''
  const [form] = Form.useForm()
  const [banners, setBanners] = useState<BannerResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileListRef = useRef<File[]>([])

  const fetchBanners = useCallback(async () => {
    if (!token) return
    setLoading(true)
    try {
      const data = await getAllBanners(token)
      setBanners(data)
    } catch {
      /* empty */
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBanners()
  }, [fetchBanners])

  const openAddModal = () => {
    setEditingId(null)
    form.resetFields()
    setPreviewUrl(null)
    fileListRef.current = []
    setModalOpen(true)
  }

  const openEditModal = (record: BannerResponse) => {
    setEditingId(record.bannerId)
    form.setFieldsValue({
      title: record.title,
      subtitle: record.subtitle,
      content: record.content,
      buttonText: record.buttonText,
      buttonLink: record.buttonLink,
      displayOrder: record.displayOrder,
      isActive: record.isActive,
    })
    setPreviewUrl(record.imageUrl)
    fileListRef.current = []
    setModalOpen(true)
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setEditingId(null)
    form.resetFields()
    setPreviewUrl(null)
    fileListRef.current = []
  }

  const handleImageChange = (file: File) => {
    fileListRef.current = [file]
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    return false
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setSubmitting(true)

      const payload = {
        title: values.title,
        subtitle: values.subtitle || '',
        content: values.content || '',
        buttonText: values.buttonText || '',
        buttonLink: values.buttonLink || '',
        displayOrder: values.displayOrder ?? 0,
        isActive: values.isActive ?? true,
      }

      const imageFile = fileListRef.current[0]

      if (editingId) {
        await updateBanner(token, editingId, payload, imageFile)
        message.success('Cập nhật banner thành công')
      } else {
        if (!imageFile) {
          message.error('Vui lòng chọn ảnh banner')
          setSubmitting(false)
          return
        }
        await createBanner(token, payload, imageFile)
        message.success('Thêm banner thành công')
      }
      fetchBanners()
      handleModalClose()
    } catch {
      // validation error or API error
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteBanner(token, id)
      message.success('Xóa banner thành công')
      fetchBanners()
    } catch {
      message.error('Xóa banner thất bại')
    }
  }

  const columns = [
    {
      title: 'STT',
      dataIndex: 'displayOrder',
      key: 'displayOrder',
      width: 70,
      render: (val: number) => val ?? 0,
    },
    {
      title: 'Ảnh',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 120,
      render: (url: string) => (
        <Image
          src={url}
          alt="Banner"
          width={80}
          height={50}
          style={{ objectFit: 'cover', borderRadius: 8 }}
        />
      ),
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
      width: 200,
      render: (val: string) => val || '-',
    },
    {
      title: 'Nút CTA',
      key: 'cta',
      width: 150,
      render: (_: unknown, record: BannerResponse) =>
        record.buttonText ? <Tag color="blue">{record.buttonText}</Tag> : '-',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (active: boolean) => (
        <Tag color={active ? 'green' : 'red'}>{active ? 'Hiển thị' : 'Ẩn'}</Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 120,
      render: (_: unknown, record: BannerResponse) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<Pencil size={14} />}
            onClick={() => openEditModal(record)}
          />
          <Popconfirm
            title="Xóa banner này?"
            onConfirm={() => handleDelete(record.bannerId)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="link" size="small" danger icon={<Trash2 size={14} />} />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Quản lý Banner quảng cáo</h2>
        <Button
          type="primary"
          icon={<Plus size={16} />}
          onClick={openAddModal}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          Thêm banner
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={banners}
        rowKey="bannerId"
        loading={loading}
        pagination={false}
      />

      <Modal
        title={editingId ? 'Chỉnh sửa banner' : 'Thêm banner mới'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={handleModalClose}
        confirmLoading={submitting}
        okText={editingId ? 'Cập nhật' : 'Thêm mới'}
        cancelText="Hủy"
        width={600}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
          >
            <Input placeholder="Nhập tiêu đề banner" maxLength={200} />
          </Form.Item>

          <Form.Item name="subtitle" label="Tiêu đề phụ">
            <Input placeholder="Nhập tiêu đề phụ" maxLength={500} />
          </Form.Item>

          <Form.Item name="content" label="Nội dung">
            <Input.TextArea placeholder="Nhập nội dung mô tả" rows={3} />
          </Form.Item>

          <Form.Item label="Ảnh banner" required={!editingId}>
            <div className="flex items-center gap-4">
              <Upload
                beforeUpload={(file) => {
                  handleImageChange(file)
                  return false
                }}
                showUploadList={false}
                accept="image/*"
              >
                <Button icon={<UploadIcon size={14} />}>Chọn ảnh</Button>
              </Upload>
              {previewUrl && (
                <Image
                  src={previewUrl}
                  alt="Preview"
                  width={120}
                  height={70}
                  style={{ objectFit: 'cover', borderRadius: 8 }}
                />
              )}
            </div>
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="buttonText" label="Text nút CTA">
              <Input placeholder="VD: Khám phá ngay" maxLength={100} />
            </Form.Item>

            <Form.Item name="buttonLink" label="Link nút CTA">
              <Input placeholder="VD: /products" maxLength={500} />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="displayOrder" label="Thứ tự hiển thị">
              <InputNumber min={0} className="w-full" placeholder="0" />
            </Form.Item>

            <Form.Item name="isActive" label="Trạng thái" valuePropName="checked">
              <Switch checkedChildren="Hiển thị" unCheckedChildren="Ẩn" />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  )
}
