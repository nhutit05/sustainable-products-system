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
} from '../model/voucher.model'
import type { PageResponse } from '../model/page.model'

function VoucherForm({
  formInstance,
  onFinish,
  isEdit,
}: {
  formInstance: ReturnType<typeof Form.useForm>[0]
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
        <Input placeholder="VD: SUMMER2025" />
      </Form.Item>
      <Form.Item
        label="Mô tả"
        name="description"
        rules={[{ required: true, message: 'Vui lòng nhập mô tả.' }]}
      >
        <Input.TextArea rows={3} placeholder="Mô tả về voucher..." />
      </Form.Item>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Form.Item
          label="Giảm giá (%)"
          name="discountValue"
          rules={[{ required: true, message: 'Bắt buộc.' }]}
        >
          <InputNumber min={1} max={100} className="w-full" placeholder="1-100" />
        </Form.Item>
        <Form.Item
          label="Số lượng"
          name="quantity"
          rules={[{ required: true, message: 'Bắt buộc.' }]}
        >
          <InputNumber min={1} className="w-full" placeholder="Số lượng phát hành" />
        </Form.Item>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Form.Item
          label="Ngày bắt đầu"
          name="startedAt"
          rules={[{ required: true, message: 'Bắt buộc.' }]}
        >
          <DatePicker className="w-full" format="DD/MM/YYYY" />
        </Form.Item>
        <Form.Item
          label="Ngày hết hạn"
          name="expiredAt"
          rules={[{ required: true, message: 'Bắt buộc.' }]}
        >
          <DatePicker className="w-full" format="DD/MM/YYYY" />
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
      render: (value: string) => <span className="font-semibold text-emerald-700">{value}</span>,
    },
    {
      title: 'Giảm giá',
      dataIndex: 'discountValue',
      align: 'center',
      responsive: ['md'],
      render: (value: number) => (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
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
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
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
          <span
            className={`whitespace-nowrap text-sm ${isExpired ? 'text-red-500' : 'text-gray-600'}`}
          >
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
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
            isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {isActive ? (
            <CheckCircleOutlined className="text-[10px]" />
          ) : (
            <CloseCircleOutlined className="text-[10px]" />
          )}
          {isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      align: 'center',
      width: 120,
      render: (_, record) => (
        <div className="flex items-center justify-center gap-1">
          <Tooltip title="Xem chi tiết">
            <button
              onClick={() => handleView(record.voucherId)}
              className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-50 transition-colors cursor-pointer"
            >
              <EyeOutlined />
            </button>
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <button
              onClick={() => handleEdit(record.voucherId)}
              className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors cursor-pointer"
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
              <button className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer">
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
    if (values.code !== editingVoucher.code) request.code = values.code
    if (values.description !== editingVoucher.description) request.description = values.description
    if (values.discountValue !== editingVoucher.discountValue)
      request.discountValue = values.discountValue
    if (values.quantity !== editingVoucher.quantity) request.quantity = values.quantity

    const startedAt = values.startedAt?.format('YYYY-MM-DD')
    if (startedAt !== editingVoucher.startedAt) request.startedAt = startedAt

    const expiredAt = values.expiredAt?.format('YYYY-MM-DD')
    if (expiredAt !== editingVoucher.expiredAt) request.expiredAt = expiredAt

    if (values.isActive !== editingVoucher.isActive) request.isActive = values.isActive

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
        ...values,
        startedAt: dayjs(values.startedAt).format('YYYY-MM-DD'),
        expiredAt: dayjs(values.expiredAt).format('YYYY-MM-DD'),
      }
      const created = await createVoucher(request)
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
      <header className="bg-white rounded-2xl shadow p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <div>
            <h1 className="text-2xl font-semibold text-emerald-900">Quản lý Voucher</h1>
            <p className="text-sm text-gray-400 mt-1">
              Quản lý mã giảm giá và ưu đãi cho khách hàng
            </p>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            className="!bg-emerald-600 !border-emerald-600 hover:!bg-emerald-700"
            onClick={() => setCreateOpen(true)}
          >
            Thêm Voucher
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="flex items-center gap-3 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl p-4 border border-emerald-200/60">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-500 text-white">
              <TagsOutlined />
            </div>
            <div>
              <p className="text-xs text-gray-500">Tổng cộng</p>
              <p className="text-lg font-bold text-emerald-800">{stats.total}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-4 border border-green-200/60">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-500 text-white">
              <CheckCircleOutlined />
            </div>
            <div>
              <p className="text-xs text-gray-500">Đang hoạt động</p>
              <p className="text-lg font-bold text-green-800">-</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-gradient-to-br from-red-50 to-red-100/50 rounded-xl p-4 border border-red-200/60">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-500 text-white">
              <CloseCircleOutlined />
            </div>
            <div>
              <p className="text-xs text-gray-500">Ngừng hoạt động</p>
              <p className="text-lg font-bold text-red-800">-</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl p-4 border border-orange-200/60">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-orange-500 text-white">
              <PercentageOutlined />
            </div>
            <div>
              <p className="text-xs text-gray-500">Lượt sử dụng</p>
              <p className="text-lg font-bold text-orange-800">-</p>
            </div>
          </div>
        </div>
      </header>

      {/* ================= FILTERS ================= */}
      <div className="bg-white rounded-2xl shadow p-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <Input
            placeholder="Tìm theo mã hoặc mô tả..."
            prefix={<SearchOutlined className="text-gray-400" />}
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="flex-1"
          />
          <Select
            value={query.active}
            placeholder="Trạng thái"
            allowClear
            className="w-full sm:w-[160px]"
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
            onClick={() => {
              setSearchText('')
              setQuery({
                page: 0,
                size: 10,
                sortBy: 'expiredAt',
                direction: 'desc',
              })
            }}
          >
            Làm mới
          </Button>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-2xl shadow p-5">
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
        title="Thêm Voucher Mới"
        open={createOpen}
        onCancel={() => {
          form.resetFields()
          setCreateOpen(false)
        }}
        onOk={() => form.submit()}
        okText="Tạo mới"
        cancelText="Huỷ"
        okButtonProps={{ className: '!bg-emerald-600 !border-emerald-600' }}
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
        title="Chỉnh sửa Voucher"
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
        okButtonProps={{ className: '!bg-emerald-600 !border-emerald-600' }}
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
          title="Chi tiết Voucher"
          open={viewOpen}
          footer={null}
          width={520}
          onCancel={() => {
            setViewOpen(false)
            setSelectedVoucher(null)
          }}
        >
          {selectedVoucher && (
            <div className="space-y-4">
              {/* Info Section */}
              <div className="rounded-xl border border-gray-200 overflow-hidden">
                <div className="bg-emerald-50 px-4 py-2.5 border-b border-emerald-100">
                  <h3 className="text-sm font-semibold text-emerald-800">Thông tin voucher</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  <div className="flex items-center px-4 py-3">
                    <span className="w-32 text-sm text-gray-500 shrink-0">Mã voucher</span>
                    <span className="text-sm font-semibold text-emerald-700">
                      {selectedVoucher.code}
                    </span>
                  </div>
                  <div className="flex items-start px-4 py-3">
                    <span className="w-32 text-sm text-gray-500 shrink-0">Mô tả</span>
                    <span className="text-sm text-gray-700">
                      {selectedVoucher.description || '-'}
                    </span>
                  </div>
                  <div className="flex items-center px-4 py-3">
                    <span className="w-32 text-sm text-gray-500 shrink-0">Giảm giá</span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                      <PercentageOutlined className="text-[10px]" />
                      {selectedVoucher.discountValue}%
                    </span>
                  </div>
                  <div className="flex items-center px-4 py-3">
                    <span className="w-32 text-sm text-gray-500 shrink-0">Số lượng</span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {selectedVoucher.quantity}
                    </span>
                  </div>
                </div>
              </div>

              {/* Date & Status Section */}
              <div className="rounded-xl border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700">Thời hạn & Trạng thái</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  <div className="flex items-center px-4 py-3">
                    <span className="w-32 text-sm text-gray-500 shrink-0">Ngày bắt đầu</span>
                    <span className="text-sm text-gray-700">
                      {dayjs(selectedVoucher.startedAt).format('DD/MM/YYYY')}
                    </span>
                  </div>
                  <div className="flex items-center px-4 py-3">
                    <span className="w-32 text-sm text-gray-500 shrink-0">Ngày hết hạn</span>
                    <span
                      className={`text-sm ${dayjs(selectedVoucher.expiredAt).isBefore(dayjs(), 'day') ? 'text-red-500 font-medium' : 'text-gray-700'}`}
                    >
                      {dayjs(selectedVoucher.expiredAt).format('DD/MM/YYYY')}
                    </span>
                  </div>
                  <div className="flex items-center px-4 py-3">
                    <span className="w-32 text-sm text-gray-500 shrink-0">Trạng thái</span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                        selectedVoucher.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {selectedVoucher.isActive ? (
                        <CheckCircleOutlined className="text-[10px]" />
                      ) : (
                        <CloseCircleOutlined className="text-[10px]" />
                      )}
                      {selectedVoucher.isActive ? 'Active' : 'Inactive'}
                    </span>
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
