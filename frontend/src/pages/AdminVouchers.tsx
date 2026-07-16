import { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  message,
  Popconfirm,
  Select,
  Spin,
  Switch,
  Table,
  Tooltip,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
  PercentageOutlined,
  TagsOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CalendarOutlined,
  FileTextOutlined,
  GiftOutlined,
  ShoppingOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons'

import {
  createVoucher,
  updateVoucher,
  deleteVoucher,
  getAllForAdmin,
  getById,
} from '../services/voucher.service'
import type {
  VoucherSummary,
  VoucherQuery,
  VoucherResponse,
  VoucherPatchRequest,
  VoucherRequest,
} from '../model/voucher.model'
import type { PageResponse } from '../model/page.model'

function VoucherForm({
  formInstance,
  onFinish,
  isEdit,
}: {
  formInstance: ReturnType<typeof Form.useForm<Record<string, unknown>>>[0]
  onFinish: (values: Record<string, unknown>) => void
  isEdit: boolean
}) {
  return (
    <Form form={formInstance} layout="vertical" onFinish={onFinish}>
      <Form.Item
        label="Mã voucher"
        name="code"
        rules={[{ required: true, message: 'Vui lòng nhập mã voucher.' }]}
      >
        <Input
          placeholder="VD: SUMMER2025"
          prefix={<GiftOutlined className="text-emerald-400" />}
          size="large"
          className="!rounded-xl"
        />
      </Form.Item>
      <Form.Item
        label="Mô tả"
        name="description"
        rules={[{ required: true, message: 'Vui lòng nhập mô tả.' }]}
      >
        <Input.TextArea
          rows={3}
          placeholder="Mô tả về voucher..."
          className="!rounded-xl"
        />
      </Form.Item>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Form.Item
          label="Giảm giá (%)"
          name="discountValue"
          rules={[{ required: true, message: 'Bắt buộc.' }]}
        >
          <InputNumber
            min={1}
            max={100}
            className="!w-full"
            placeholder="1-100"
            size="large"
            prefix={<PercentageOutlined className="text-emerald-400" />}
          />
        </Form.Item>
        <Form.Item
          label="Số lượng"
          name="quantity"
          rules={[{ required: true, message: 'Bắt buộc.' }]}
        >
          <InputNumber
            min={1}
            className="!w-full"
            placeholder="Số lượng phát hành"
            size="large"
            prefix={<ShoppingOutlined className="text-emerald-400" />}
          />
        </Form.Item>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Form.Item
          label="Ngày bắt đầu"
          name="startedAt"
          rules={[{ required: true, message: 'Bắt buộc.' }]}
        >
          <DatePicker
            className="!w-full"
            format="DD/MM/YYYY"
            size="large"
            placeholder="Chọn ngày"
          />
        </Form.Item>
        <Form.Item
          label="Ngày hết hạn"
          name="expiredAt"
          rules={[{ required: true, message: 'Bắt buộc.' }]}
        >
          <DatePicker
            className="!w-full"
            format="DD/MM/YYYY"
            size="large"
            placeholder="Chọn ngày"
          />
        </Form.Item>
      </div>
      <Form.Item label="Kích hoạt" name="isActive" valuePropName="checked" initialValue={!isEdit}>
        <Switch />
      </Form.Item>
    </Form>
  )
}

export default function AdminVouchers() {
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [form] = Form.useForm()
  const [viewOpen, setViewOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  const [updating, setUpdating] = useState(false)
  const [editingVoucherId, setEditingVoucherId] = useState<number>()
  const [editingVoucher, setEditingVoucher] = useState<VoucherResponse | null>(null)
  const [editForm] = Form.useForm()

  const [selectedVoucher, setSelectedVoucher] = useState<VoucherResponse | null>(null)
  const [viewLoading, setViewLoading] = useState(false)

  const [voucherPage, setVoucherPage] = useState<PageResponse<VoucherSummary>>()

  const [query, setQuery] = useState<VoucherQuery>({
    page: 0,
    size: 10,
    sortBy: 'expiredAt',
    direction: 'desc',
  })

  useEffect(() => {
    let cancelled = false
    async function fetchVouchers() {
      setLoading(true)
      try {
        const data = await getAllForAdmin(query)
        if (!cancelled) setVoucherPage(data)
      } catch (error) {
        console.error(error)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchVouchers()
    return () => {
      cancelled = true
    }
  }, [query])

  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery((prev) => {
        const keyword = searchText.trim() || undefined
        if (prev.keyword === keyword) return prev
        return { ...prev, page: 0, keyword }
      })
    }, 300)
    return () => clearTimeout(timer)
  }, [searchText])

  const stats = useMemo(() => {
    const all = voucherPage?.totalElements ?? 0
    return { total: all }
  }, [voucherPage])

  const columns: ColumnsType<VoucherSummary> = [
    {
      title: 'Code',
      dataIndex: 'code',
      sorter: true,
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shrink-0">
            <TagsOutlined className="text-white text-xs" />
          </div>
          <span className="font-semibold text-emerald-700">{value}</span>
        </div>
      ),
    },
    {
      title: 'Giảm giá',
      dataIndex: 'discountValue',
      align: 'center',
      responsive: ['md'],
      render: (value: number) => (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
          <PercentageOutlined className="text-[10px]" />
          {value}%
        </span>
      ),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      align: 'center',
      responsive: ['lg'],
      render: (value: number) => (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          {value}
        </span>
      ),
    },
    {
      title: 'Hết hạn',
      dataIndex: 'expiredAt',
      key: 'expiredAt',
      align: 'center',
      render: (value: string) => {
        const isExpired = dayjs(value).isBefore(dayjs(), 'day')
        return (
          <span className={`whitespace-nowrap text-sm font-medium ${isExpired ? 'text-red-500' : 'text-gray-600'}`}>
            {dayjs(value).format('DD/MM/YYYY')}
          </span>
        )
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      align: 'center',
      render: (isActive: boolean) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
            isActive
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-gray-100 text-gray-600 border border-gray-200'
          }`}
        >
          {isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          {isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      align: 'center',
      width: 130,
      render: (_, record) => (
        <div className="flex items-center justify-center gap-1">
          <Tooltip title="Xem chi tiết">
            <button
              onClick={() => handleView(record.voucherId)}
              className="p-2 rounded-xl text-amber-500 hover:bg-amber-50 hover:text-amber-600 transition-all cursor-pointer"
            >
              <EyeOutlined />
            </button>
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <button
              onClick={() => handleEdit(record.voucherId)}
              className="p-2 rounded-xl text-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-all cursor-pointer"
            >
              <EditOutlined />
            </button>
          </Tooltip>
          <Popconfirm
            title="Xoá voucher này?"
            description="Hành động này không thể hoàn tác."
            okText="Xoá"
            cancelText="Huỷ"
            onConfirm={() => handleDelete(record.voucherId)}
          >
            <Tooltip title="Xoá">
              <button className="p-2 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer">
                <DeleteOutlined />
              </button>
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ]

  async function handleDelete(id: number) {
    try {
      await deleteVoucher(id)
      message.success('Đã xoá voucher.')
      setVoucherPage((prev) => {
        if (!prev) return prev
        const next = prev.content.filter((v) => v.voucherId !== id)
        if (next.length === 0 && prev.number > 0) {
          setQuery((q) => ({ ...q, page: q.page - 1 }))
        }
        return { ...prev, content: next, totalElements: prev.totalElements - 1 }
      })
    } catch {
      message.error('Xoá voucher thất bại.')
    }
  }

  async function handleUpdate(values: Record<string, unknown>) {
    if (!editingVoucher || !editingVoucherId) return

    const request: VoucherPatchRequest = {}
    if (values.code !== editingVoucher.code) request.code = values.code as string
    if (values.description !== editingVoucher.description) request.description = values.description as string
    if (values.discountValue !== editingVoucher.discountValue)
      request.discountValue = values.discountValue as number
    if (values.quantity !== editingVoucher.quantity) request.quantity = values.quantity as number

    const startedAt = (values.startedAt as dayjs.Dayjs)?.format('YYYY-MM-DD')
    if (startedAt !== editingVoucher.startedAt) request.startedAt = startedAt

    const expiredAt = (values.expiredAt as dayjs.Dayjs)?.format('YYYY-MM-DD')
    if (expiredAt !== editingVoucher.expiredAt) request.expiredAt = expiredAt

    if (values.isActive !== editingVoucher.isActive) request.isActive = values.isActive as boolean

    if (Object.keys(request).length === 0) {
      message.info('Không có thay đổi nào.')
      return
    }

    try {
      setUpdating(true)
      const updated = await updateVoucher(editingVoucherId, request)
      message.success('Cập nhật voucher thành công.')
      editForm.resetFields()
      setEditingVoucher(null)
      setEditOpen(false)
      const summary: VoucherSummary = {
        voucherId: updated.voucherId,
        code: updated.code,
        description: updated.description,
        discountValue: updated.discountValue,
        quantity: updated.quantity,
        expiredAt: updated.expiredAt,
        isActive: updated.isActive,
      }
      setVoucherPage((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          content: prev.content.map((v) => (v.voucherId === summary.voucherId ? summary : v)),
        }
      })
    } catch (error) {
      console.error(error)
      message.error('Cập nhật voucher thất bại.')
    } finally {
      setUpdating(false)
    }
  }

  async function handleEdit(id: number) {
    try {
      const voucher = await getById(id)
      setEditingVoucher(voucher)
      editForm.setFieldsValue({
        code: voucher.code,
        description: voucher.description,
        discountValue: voucher.discountValue,
        quantity: voucher.quantity,
        startedAt: dayjs(voucher.startedAt),
        expiredAt: dayjs(voucher.expiredAt),
        isActive: voucher.isActive,
      })
      setEditingVoucherId(id)
      setEditOpen(true)
    } catch (error) {
      console.error(error)
      message.error('Không thể tải voucher.')
    }
  }

  async function handleView(id: number) {
    try {
      setViewLoading(true)
      const voucher = await getById(id)
      setSelectedVoucher(voucher)
      setViewOpen(true)
    } catch (error) {
      console.error(error)
      message.error('Không thể tải voucher.')
    } finally {
      setViewLoading(false)
    }
  }

  async function handleCreate(values: Record<string, unknown>) {
    try {
      const request = {
        code: values.code as string,
        description: values.description as string,
        discountValue: values.discountValue as number,
        quantity: values.quantity as number,
        isActive: values.isActive as boolean,
        startedAt: dayjs(values.startedAt as string).format('YYYY-MM-DD'),
        expiredAt: dayjs(values.expiredAt as string).format('YYYY-MM-DD'),
      }
      const created = await createVoucher(request as VoucherRequest)
      message.success('Tạo voucher thành công.')
      form.resetFields()
      setCreateOpen(false)
      const summary: VoucherSummary = {
        voucherId: created.voucherId,
        code: created.code,
        description: created.description,
        discountValue: created.discountValue,
        quantity: created.quantity,
        expiredAt: created.expiredAt,
        isActive: created.isActive,
      }
      setVoucherPage((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          content: [summary, ...prev.content],
          totalElements: prev.totalElements + 1,
        }
      })
    } catch (error) {
      console.error(error)
      message.error('Tạo voucher thất bại.')
    }
  }

  return (
    <div className="flex flex-col gap-4 px-4">
      {/* ================= HEADER ================= */}
      <header className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl shadow-lg p-5 sm:p-6 text-white relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold m-0 flex items-center gap-2">
              <GiftOutlined />
              Quản lý Voucher
            </h1>
            <p className="text-sm text-white/70 mt-1">
              Quản lý mã giảm giá và ưu đãi cho khách hàng
            </p>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => setCreateOpen(true)}
            className="!bg-white !border-white !text-emerald-600 hover:!bg-white/90 !font-semibold !shadow-lg !rounded-xl"
          >
            Thêm Voucher
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20 hover:bg-white/20 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <TagsOutlined className="text-white text-lg" />
              </div>
              <div>
                <p className="text-xs text-white/60 m-0">Tổng cộng</p>
                <p className="text-xl font-bold text-white m-0">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20 hover:bg-white/20 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-400/30 flex items-center justify-center shrink-0">
                <CheckCircleOutlined className="text-green-200 text-lg" />
              </div>
              <div>
                <p className="text-xs text-white/60 m-0">Đang hoạt động</p>
                <p className="text-xl font-bold text-green-200 m-0">-</p>
              </div>
            </div>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20 hover:bg-white/20 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-400/30 flex items-center justify-center shrink-0">
                <CloseCircleOutlined className="text-red-200 text-lg" />
              </div>
              <div>
                <p className="text-xs text-white/60 m-0">Ngừng hoạt động</p>
                <p className="text-xl font-bold text-red-200 m-0">-</p>
              </div>
            </div>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20 hover:bg-white/20 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-400/30 flex items-center justify-center shrink-0">
                <PercentageOutlined className="text-orange-200 text-lg" />
              </div>
              <div>
                <p className="text-xs text-white/60 m-0">Lượt sử dụng</p>
                <p className="text-xl font-bold text-orange-200 m-0">-</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ================= FILTERS ================= */}
      <div className="bg-white rounded-2xl shadow p-4 sm:p-5 border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <Input
            placeholder="Tìm theo mã hoặc mô tả..."
            prefix={<SearchOutlined className="text-emerald-400" />}
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            size="large"
            className="!rounded-xl flex-1"
          />
          <Select
            value={query.active}
            placeholder="Trạng thái"
            allowClear
            size="large"
            className="!rounded-xl w-full sm:w-[160px]"
            onChange={(value) => {
              setQuery((prev) => ({ ...prev, page: 0, active: value }))
            }}
            options={[
              { label: 'Active', value: true },
              { label: 'Inactive', value: false },
            ]}
          />
          <Button
            icon={<ReloadOutlined />}
            size="large"
            onClick={() => {
              setSearchText('')
              setQuery({
                page: 0,
                size: 10,
                sortBy: 'expiredAt',
                direction: 'desc',
              })
            }}
            className="!rounded-xl"
          >
            Làm mới
          </Button>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-2xl shadow p-4 sm:p-5 border border-gray-100">
        <Spin spinning={loading} size="medium">
          <div className="overflow-x-auto">
            <Table
              rowKey="voucherId"
              columns={columns}
              dataSource={voucherPage?.content}
              pagination={{
                current: query.page + 1,
                pageSize: query.size,
                total: voucherPage?.totalElements,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => (
                  <span className="text-sm text-gray-500">
                    Hiển thị <b>{voucherPage?.content?.length ?? 0}</b> / <b>{total}</b> voucher
                  </span>
                ),
                onChange: (page, pageSize) => {
                  setQuery((prev) => ({
                    ...prev,
                    page: page - 1,
                    size: pageSize,
                  }))
                },
              }}
            />
          </div>
        </Spin>
      </div>

      {/* ================= CREATE MODAL ================= */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
              <PlusOutlined className="text-emerald-600" />
            </div>
            <span>Thêm Voucher Mới</span>
          </div>
        }
        open={createOpen}
        onCancel={() => {
          form.resetFields()
          setCreateOpen(false)
        }}
        onOk={() => form.submit()}
        okText="Tạo mới"
        cancelText="Huỷ"
        okButtonProps={{ className: '!bg-emerald-600 !border-emerald-600 !rounded-xl' }}
        className="!top-[10vh]"
        width={520}
        styles={{
          body: {
            maxHeight: 'calc(100vh - 220px)',
            overflowY: 'auto',
            paddingRight: 8,
          },
        }}
      >
        <VoucherForm formInstance={form} onFinish={handleCreate} isEdit={false} />
      </Modal>

      {/* ================= EDIT MODAL ================= */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <EditOutlined className="text-blue-600" />
            </div>
            <span>Chỉnh sửa Voucher</span>
          </div>
        }
        open={editOpen}
        forceRender
        onCancel={() => {
          editForm.resetFields()
          setEditingVoucher(null)
          setEditOpen(false)
        }}
        confirmLoading={updating}
        onOk={() => editForm.submit()}
        okText="Lưu"
        cancelText="Huỷ"
        okButtonProps={{ className: '!bg-emerald-600 !border-emerald-600 !rounded-xl' }}
        className="!top-[10vh]"
        width={520}
        styles={{
          body: {
            maxHeight: 'calc(100vh - 220px)',
            overflowY: 'auto',
            paddingRight: 8,
          },
        }}
      >
        <VoucherForm formInstance={editForm} onFinish={handleUpdate} isEdit={true} />
      </Modal>

      {/* ================= VIEW MODAL ================= */}
      <Spin spinning={viewLoading}>
        <Modal
          title={
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                <EyeOutlined className="text-amber-600" />
              </div>
              <span>Chi tiết Voucher</span>
            </div>
          }
          open={viewOpen}
          footer={null}
          className="!top-[10vh]"
          width={520}
          onCancel={() => {
            setViewOpen(false)
            setSelectedVoucher(null)
          }}
        >
          {selectedVoucher && (
            <div className="space-y-4">
              {/* Voucher Header Card */}
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-5 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                      <GiftOutlined className="text-white text-xl" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold m-0">{selectedVoucher.code}</h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                        selectedVoucher.isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-white/70'
                      }`}>
                        {selectedVoucher.isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                        {selectedVoucher.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-3xl font-bold">{selectedVoucher.discountValue}%</span>
                    <span className="text-white/70 text-sm">giảm giá</span>
                  </div>
                </div>
              </div>

              {/* Info Section */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <h4 className="text-sm font-semibold text-gray-700 m-0 mb-3 flex items-center gap-2">
                  <FileTextOutlined className="text-gray-500" />
                  Thông tin chi tiết
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Mô tả</span>
                    <span className="text-sm text-gray-700 text-right max-w-[60%]">
                      {selectedVoucher.description || '-'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Số lượng</span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-100 text-blue-700">
                      {selectedVoucher.quantity}
                    </span>
                  </div>
                </div>
              </div>

              {/* Date & Status Section */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <h4 className="text-sm font-semibold text-gray-700 m-0 mb-3 flex items-center gap-2">
                  <CalendarOutlined className="text-gray-500" />
                  Thời hạn
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-lg p-3 border border-gray-100">
                    <p className="text-xs text-gray-400 m-0 mb-1">Bắt đầu</p>
                    <p className="text-sm font-semibold text-gray-700 m-0">
                      {dayjs(selectedVoucher.startedAt).format('DD/MM/YYYY')}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-gray-100">
                    <p className="text-xs text-gray-400 m-0 mb-1">Hết hạn</p>
                    <p className={`text-sm font-semibold m-0 ${
                      dayjs(selectedVoucher.expiredAt).isBefore(dayjs(), 'day')
                        ? 'text-red-500'
                        : 'text-gray-700'
                    }`}>
                      {dayjs(selectedVoucher.expiredAt).format('DD/MM/YYYY')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </Spin>
    </div>
  )
}
