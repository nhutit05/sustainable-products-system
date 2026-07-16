import React, { useEffect, useState } from 'react'
import {
  CheckCircle,
  X,
  Eye,
  Search,
  RotateCw,
  Wallet,
  FileText,
  Clock,
  Building2,
  CreditCard,
  User,
  CalendarDays,
  Filter,
  XCircle,
  Hash,
} from 'lucide-react'
import {
  Table,
  Tag,
  Button,
  Input,
  Select,
  DatePicker,
  Spin,
  message,
  Popconfirm,
  Pagination,
  Drawer,
  Descriptions,
  Tooltip,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

import type { RefundSlipResponse } from '../types/refundslip'
import { useNotification } from '../context/useNotification'

const { RangePicker } = DatePicker

function formatDate(value: unknown): string {
  if (!value) return '-'
  try {
    if (Array.isArray(value)) {
      const [y, m, d, h = 0, mi = 0, s = 0] = value
      return dayjs(new Date(y, m - 1, d, h, mi, s)).format('DD/MM/YYYY HH:mm')
    }
    return dayjs((value + 'Z') as string).format('DD/MM/YYYY HH:mm')
  } catch {
    return '-'
  }
}

export default function AdminRefundSlip() {
  const token = localStorage.getItem('token')
  const { showNotification } = useNotification()

  const [refundSlips, setRefundSlips] = useState<RefundSlipResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined)
  const [dateRange, setDateRange] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedRefundSlip, setSelectedRefundSlip] = useState<RefundSlipResponse | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const statusOptions = [
    { value: '', label: 'Tất cả' },
    { value: 'PENDING', label: 'Đang chờ xử lý' },
    { value: 'APPROVED', label: 'Đã duyệt' },
    { value: 'REJECTED', label: 'Đã từ chối' },
    { value: 'REFUNDED', label: 'Đã hoàn tiền' },
  ]

  const statusMap: Record<string, { color: string; label: string; icon: React.ReactNode }> = {
    PENDING: { color: 'warning', label: 'Đang chờ xử lý', icon: <Clock size={14} /> },
    APPROVED: { color: 'processing', label: 'Đã duyệt', icon: <CheckCircle size={14} /> },
    REJECTED: { color: 'error', label: 'Đã từ chối', icon: <XCircle size={14} /> },
    REFUNDED: { color: 'success', label: 'Đã hoàn tiền', icon: <Wallet size={14} /> },
  }

  const hasActiveFilters = searchQuery || selectedStatus || dateRange

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 300)
    return () => clearTimeout(timeout)
  }, [searchQuery])

  const filterByDateRange = (items: RefundSlipResponse[]): RefundSlipResponse[] => {
    if (!dateRange || !dateRange[0] || !dateRange[1]) return items
    const start = dayjs(dateRange[0]).startOf('day')
    const end = dayjs(dateRange[1]).endOf('day')
    return items.filter((item) => {
      const created = dayjs(item.createdAt)
      return created.isAfter(start.subtract(1, 'ms')) && created.isBefore(end.add(1, 'ms'))
    })
  }

  const fetchRefundSlips = async () => {
    if (!token) return
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (debouncedSearch) params.append('search', debouncedSearch)
      if (selectedStatus) params.append('status', selectedStatus)
      params.append('page', (currentPage - 1).toString())
      params.append('size', pageSize.toString())
      const response = await fetch(
        `http://localhost:8080/api/admin/refund-slips?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (response.ok) {
        const data = await response.json()
        const filtered = filterByDateRange(data.content)
        setRefundSlips(filtered)
        if (dateRange) {
          setTotalElements(filtered.length)
          setTotalPages(1)
        } else {
          setTotalElements(data.totalElements)
          setTotalPages(data.totalPages)
        }
      } else {
        message.error('Không thể tải danh sách yêu cầu hoàn tiền.')
      }
    } catch {
      message.error('Có lỗi xảy ra khi tải danh sách.')
    } finally {
      setLoading(false)
    }
  }

  const fetchRefundSlipDetail = async (refundSlipId: number) => {
    if (!token) return
    setDetailLoading(true)
    setDrawerOpen(true)
    try {
      const response = await fetch(`http://localhost:8080/api/admin/refund-slips/${refundSlipId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setSelectedRefundSlip(data)
      } else {
        message.error('Không thể tải chi tiết yêu cầu hoàn tiền.')
        setSelectedRefundSlip(null)
        setDrawerOpen(false)
      }
    } catch {
      message.error('Có lỗi xảy ra khi tải chi tiết.')
      setSelectedRefundSlip(null)
      setDrawerOpen(false)
    } finally {
      setDetailLoading(false)
    }
  }

  const handleApprove = async (refundSlipId: number) => {
    if (!token) return
    setActionLoading(true)
    try {
      const response = await fetch(
        `http://localhost:8080/api/admin/refund-slips/${refundSlipId}/approve`,
        { method: 'PATCH', headers: { Authorization: `Bearer ${token}` } }
      )
      if (response.ok) {
        showNotification({
          message: 'Duyệt yêu cầu hoàn tiền thành công',
          type: 'SUCCESS',
          duration: 3000,
        })
        setRefundSlips((prev) =>
          prev.map((r) =>
            r.refundSlipId === refundSlipId
              ? { ...r, refundStatusName: 'APPROVED', updatedAt: new Date().toISOString() }
              : r
          )
        )
        if (selectedRefundSlip?.refundSlipId === refundSlipId) {
          setSelectedRefundSlip((prev) =>
            prev ? { ...prev, refundStatusName: 'APPROVED', updatedAt: new Date().toISOString() } : prev
          )
        }
      } else {
        const err = await response.json()
        message.error(err.message || 'Không thể duyệt yêu cầu hoàn tiền.')
      }
    } catch {
      message.error('Có lỗi xảy ra khi duyệt yêu cầu.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async (refundSlipId: number) => {
    if (!token) return
    setActionLoading(true)
    try {
      const response = await fetch(
        `http://localhost:8080/api/admin/refund-slips/${refundSlipId}/reject`,
        { method: 'PATCH', headers: { Authorization: `Bearer ${token}` } }
      )
      if (response.ok) {
        showNotification({
          message: 'Từ chối yêu cầu hoàn tiền thành công',
          type: 'SUCCESS',
          duration: 3000,
        })
        setRefundSlips((prev) =>
          prev.map((r) =>
            r.refundSlipId === refundSlipId
              ? { ...r, refundStatusName: 'REJECTED', updatedAt: new Date().toISOString() }
              : r
          )
        )
        if (selectedRefundSlip?.refundSlipId === refundSlipId) {
          setSelectedRefundSlip((prev) =>
            prev ? { ...prev, refundStatusName: 'REJECTED', updatedAt: new Date().toISOString() } : prev
          )
        }
      } else {
        const err = await response.json()
        message.error(err.message || 'Không thể từ chối yêu cầu hoàn tiền.')
      }
    } catch {
      message.error('Có lỗi xảy ra khi từ chối yêu cầu.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleRefund = async (refundSlipId: number) => {
    if (!token) return
    setActionLoading(true)
    try {
      const response = await fetch(
        `http://localhost:8080/api/admin/refund-slips/${refundSlipId}/refunded`,
        { method: 'PATCH', headers: { Authorization: `Bearer ${token}` } }
      )
      if (response.ok) {
        showNotification({
          message: 'Thực hiện hoàn tiền thành công',
          type: 'SUCCESS',
          duration: 3000,
        })
        setRefundSlips((prev) =>
          prev.map((r) =>
            r.refundSlipId === refundSlipId
              ? { ...r, refundStatusName: 'REFUNDED', updatedAt: new Date().toISOString() }
              : r
          )
        )
        if (selectedRefundSlip?.refundSlipId === refundSlipId) {
          setSelectedRefundSlip((prev) =>
            prev ? { ...prev, refundStatusName: 'REFUNDED', updatedAt: new Date().toISOString() } : prev
          )
        }
      } else {
        const err = await response.json()
        message.error(err.message || 'Không thể thực hiện hoàn tiền.')
      }
    } catch {
      message.error('Có lỗi xảy ra khi thực hiện hoàn tiền.')
    } finally {
      setActionLoading(false)
    }
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch, selectedStatus, dateRange])

  useEffect(() => {
    if (token) fetchRefundSlips()
  }, [token, currentPage, debouncedSearch, selectedStatus, dateRange])

  const columns: ColumnsType<RefundSlipResponse> = [
    {
      title: 'Mã yêu cầu',
      dataIndex: 'refundSlipId',
      key: 'refundSlipId',
      width: 90,
      render: (id) => <span className="font-semibold text-emerald-700">#{id}</span>,
    },
    {
      title: 'Đơn hàng',
      dataIndex: 'orderId',
      key: 'orderId',
      width: 80,
      responsive: ['md'],
      render: (orderId) => <span className="text-gray-600">#{orderId}</span>,
    },
    {
      title: 'Số tài khoản',
      dataIndex: 'bankNumber',
      key: 'bankNumber',
      width: 140,
      responsive: ['lg'],
      render: (text) => <span className="font-mono text-sm">{text}</span>,
    },
    {
      title: 'Chủ tài khoản',
      dataIndex: 'accountBankName',
      key: 'accountBankName',
      width: 150,
      responsive: ['lg'],
      render: (text) => <span className="truncate block max-w-[150px]">{text}</span>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'refundStatusName',
      key: 'refundStatusName',
      width: 150,
      render: (status: string) => {
        const cfg = statusMap[status] || statusMap.PENDING
        return (
          <Tag
            color={cfg.color}
            className="flex items-center gap-1.5 m-0 px-3 py-1 rounded-full text-xs font-medium"
          >
            {cfg.icon}
            <span className="hidden sm:inline">{cfg.label}</span>
            <span className="sm:hidden">{cfg.label.split(' ').pop()}</span>
          </Tag>
        )
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 140,
      responsive: ['md'],
      render: (val) => <span className="text-gray-500 text-sm">{formatDate(val)}</span>,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 80,
      // fixed: 'right',
      render: (_, record) => (
        <Tooltip title="Xem chi tiết">
          <Button
            type="primary"
            ghost
            icon={<Eye size={16} />}
            onClick={() => fetchRefundSlipDetail(record.refundSlipId)}
            className="flex items-center justify-center"
          />
        </Tooltip>
      ),
    },
  ]

  return (
    <div className="admin_refund-slip min-h-screen bg-gray-50/50 p-3 sm:p-4 lg:p-6">
      {/* Header */}
      <header className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4 sm:mb-6">
        {/* Banner */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                <FileText size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">Xử lý hoàn tiền</h1>
                <p className="text-emerald-100 text-xs sm:text-sm mt-0.5">
                  Quản lý và xử lý các yêu cầu hoàn tiền
                </p>
              </div>
            </div>
            <Button
              icon={<RotateCw size={16} className={loading ? 'animate-spin' : ''} />}
              onClick={fetchRefundSlips}
              loading={loading}
              className="bg-white/90 border-0 hover:bg-white text-emerald-700 font-medium shadow-sm self-start sm:self-auto"
            >
              <span className="hidden sm:inline">Làm mới</span>
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-3">
            <Filter size={16} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-600">Bộ lọc tìm kiếm</span>
            {hasActiveFilters && (
              <Tag color="emerald" className="ml-1">
                Đang lọc
              </Tag>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Input
              placeholder="Tìm mã đơn, số tài khoản..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              prefix={<Search size={16} className="text-gray-400" />}
              allowClear
              size="large"
              className="rounded-xl"
            />
            <Select
              placeholder="Chọn trạng thái"
              value={selectedStatus}
              onChange={setSelectedStatus}
              options={statusOptions}
              allowClear
              size="large"
              className="w-full rounded-xl"
              popupMatchSelectWidth={false}
            />
            <RangePicker
              value={dateRange}
              onChange={setDateRange}
              format="DD/MM/YYYY"
              placeholder={['Từ ngày', 'Đến ngày']}
              size="large"
              className="w-full rounded-xl"
              popupClassName="date-range-popup"
            />
            <Button
              onClick={() => {
                setSearchQuery('')
                setSelectedStatus(undefined)
                setDateRange(null)
              }}
              danger
              icon={<XCircle size={16} />}
              size="large"
              disabled={!hasActiveFilters}
              className="rounded-xl flex items-center justify-center"
            >
              Xóa bộ lọc
            </Button>
          </div>
        </div>
      </header>

      {/* Table */}
      <main className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Summary Bar */}
        <div className="px-4 sm:px-5 py-3 border-b border-gray-100 bg-gray-50/50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">Tổng:</span>
              <span className="font-semibold text-emerald-700">{totalElements}</span>
              <span>yêu cầu</span>
            </div>
            <div className="text-xs text-gray-400">
              Trang {currentPage}/{totalPages}
            </div>
          </div>
        </div>

        <Spin spinning={loading}>
          <div className="overflow-x-auto">
            <Table
              columns={columns}
              dataSource={refundSlips}
              rowKey="refundSlipId"
              pagination={false}
              scroll={{ x: 700 }}
              className="refund-table"
              rowClassName={(record) =>
                record.refundStatusName === 'PENDING'
                  ? 'bg-amber-50/50 hover:bg-amber-50'
                  : 'hover:bg-gray-50'
              }
            />
          </div>

          <div className="flex justify-center px-4 py-4 border-t border-gray-100">
            <Pagination
              current={currentPage}
              total={totalElements}
              pageSize={pageSize}
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger={false}
              showTotal={(total, range) => `${range[0]}-${range[1]} / ${total}`}
              responsive={true}
            />
          </div>
        </Spin>
      </main>

      {/* Detail Drawer */}
      <Drawer
        title={
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 p-2 rounded-lg">
              <FileText size={20} className="text-emerald-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-800">
                Chi tiết yêu cầu
                {selectedRefundSlip && (
                  <span className="text-emerald-600 ml-1">#{selectedRefundSlip.refundSlipId}</span>
                )}
              </div>
              <div className="text-xs text-gray-400 font-normal">
                Thông tin chi tiết về yêu cầu hoàn tiền
              </div>
            </div>
          </div>
        }
        width={window.innerWidth < 640 ? '100%' : 560}
        open={drawerOpen}
        onClose={() => {
          if (actionLoading) return
          setDrawerOpen(false)
          setSelectedRefundSlip(null)
        }}
        destroyOnHidden
        className="refund-drawer"
        styles={{
          header: { borderBottom: '1px solid #f0f0f0', padding: '16px 20px' },
          body: { padding: '20px' },
        }}
      >
        {detailLoading ? (
          <div className="flex items-center justify-center py-20">
            <Spin size="large" tip="Đang tải chi tiết..." />
          </div>
        ) : selectedRefundSlip ? (
          <div className="space-y-4">
            {/* Status Card */}
            <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      selectedRefundSlip.refundStatusName === 'PENDING'
                        ? 'bg-amber-100'
                        : selectedRefundSlip.refundStatusName === 'APPROVED'
                          ? 'bg-blue-100'
                          : selectedRefundSlip.refundStatusName === 'REFUNDED'
                            ? 'bg-green-100'
                            : 'bg-red-100'
                    }`}
                  >
                    {statusMap[selectedRefundSlip.refundStatusName]?.icon || <Clock size={20} />}
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Trạng thái hiện tại</div>
                    <Tag
                      color={statusMap[selectedRefundSlip.refundStatusName]?.color || 'default'}
                      className="text-sm px-3 py-1 rounded-full font-medium m-0"
                    >
                      {statusMap[selectedRefundSlip.refundStatusName]?.label ||
                        selectedRefundSlip.refundStatusName}
                    </Tag>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Info */}
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-gray-500" />
                  <span className="font-medium text-gray-700 text-sm">Thông tin đơn hàng</span>
                </div>
              </div>
              <div className="p-4">
                <Descriptions bordered column={1} size="small" className="refund-descriptions">
                  <Descriptions.Item
                    label={
                      <span className="flex items-center gap-1.5">
                        <Hash size={14} className="text-gray-400" />
                        Mã đơn hàng
                      </span>
                    }
                  >
                    <span className="font-semibold text-emerald-700">
                      #{selectedRefundSlip.orderId}
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <span className="flex items-center gap-1.5">
                        <FileText size={14} className="text-gray-400" />
                        Lý do hoàn tiền
                      </span>
                    }
                  >
                    <span className="text-gray-600">{selectedRefundSlip.reason || '-'}</span>
                  </Descriptions.Item>
                </Descriptions>
              </div>
            </div>

            {/* Bank Info */}
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <Building2 size={16} className="text-gray-500" />
                  <span className="font-medium text-gray-700 text-sm">
                    Thông tin tài khoản ngân hàng
                  </span>
                </div>
              </div>
              <div className="p-4">
                <Descriptions bordered column={1} size="small" className="refund-descriptions">
                  <Descriptions.Item
                    label={
                      <span className="flex items-center gap-1.5">
                        <Building2 size={14} className="text-gray-400" />
                        Ngân hàng
                      </span>
                    }
                  >
                    <span className="font-medium">
                      {selectedRefundSlip.bankName || selectedRefundSlip.bankId}
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <span className="flex items-center gap-1.5">
                        <CreditCard size={14} className="text-gray-400" />
                        Số tài khoản
                      </span>
                    }
                  >
                    <span className="font-mono font-medium text-gray-800">
                      {selectedRefundSlip.bankNumber}
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <span className="flex items-center gap-1.5">
                        <User size={14} className="text-gray-400" />
                        Chủ tài khoản
                      </span>
                    }
                  >
                    <span className="font-medium">{selectedRefundSlip.accountBankName}</span>
                  </Descriptions.Item>
                </Descriptions>
              </div>
            </div>

            {/* Time Info */}
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <CalendarDays size={16} className="text-gray-500" />
                  <span className="font-medium text-gray-700 text-sm">Thông tin thời gian</span>
                </div>
              </div>
              <div className="p-4">
                <Descriptions bordered column={1} size="small" className="refund-descriptions">
                  <Descriptions.Item
                    label={
                      <span className="flex items-center gap-1.5">
                        <CalendarDays size={14} className="text-gray-400" />
                        Ngày tạo
                      </span>
                    }
                  >
                    <span className="text-gray-600">
                      {formatDate(selectedRefundSlip.createdAt)}
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <span className="flex items-center gap-1.5">
                        <Clock size={14} className="text-gray-400" />
                        Cập nhật lần cuối
                      </span>
                    }
                  >
                    <span className="text-gray-600">
                      {formatDate(selectedRefundSlip.updatedAt)}
                    </span>
                  </Descriptions.Item>
                </Descriptions>
              </div>
            </div>

            {/* Actions */}
            {selectedRefundSlip.refundStatusName === 'PENDING' && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={16} className="text-amber-600" />
                  <span className="font-medium text-amber-800 text-sm">Hành động xử lý</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Popconfirm
                    title="Duyệt yêu cầu hoàn tiền này?"
                    description="Xác nhận duyệt yêu cầu hoàn tiền?"
                    onConfirm={() => handleApprove(selectedRefundSlip.refundSlipId)}
                    okText="Đồng ý"
                    cancelText="Huỷ"
                    okType="primary"
                    okButtonProps={{ danger: false }}
                  >
                    <Button
                      type="primary"
                      icon={<CheckCircle size={16} />}
                      loading={actionLoading}
                      className="flex-1 h-10 rounded-lg font-medium"
                    >
                      Duyệt yêu cầu
                    </Button>
                  </Popconfirm>
                  <Popconfirm
                    title="Từ chối yêu cầu hoàn tiền này?"
                    description="Xác nhận từ chối yêu cầu hoàn tiền?"
                    onConfirm={() => handleReject(selectedRefundSlip.refundSlipId)}
                    okText="Đồng ý"
                    cancelText="Huỷ"
                    okType="primary"
                    okButtonProps={{ danger: true }}
                  >
                    <Button
                      danger
                      icon={<X size={16} />}
                      loading={actionLoading}
                      className="flex-1 h-10 rounded-lg font-medium"
                    >
                      Từ chối
                    </Button>
                  </Popconfirm>
                </div>
              </div>
            )}

            {selectedRefundSlip.refundStatusName === 'APPROVED' && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Wallet size={16} className="text-green-600" />
                  <span className="font-medium text-green-800 text-sm">Xác nhận hoàn tiền</span>
                </div>
                <Popconfirm
                  title="Xác nhận thực hiện hoàn tiền?"
                  description="Hành động này sẽ xử lý hoàn tiền cho khách hàng"
                  onConfirm={() => handleRefund(selectedRefundSlip.refundSlipId)}
                  okText="Xác nhận"
                  cancelText="Huỷ"
                  okType="primary"
                >
                  <Button
                    type="primary"
                    icon={<Wallet size={16} />}
                    loading={actionLoading}
                    className="w-full h-10 rounded-lg font-medium bg-green-600 hover:bg-green-700 border-green-600"
                  >
                    Thực hiện hoàn tiền
                  </Button>
                </Popconfirm>
              </div>
            )}
          </div>
        ) : null}
      </Drawer>

      <style>{`
        .refund-table .ant-table {
          font-size: 14px;
        }
        .refund-table .ant-table-thead > tr > th {
          background: #f9fafb !important;
          font-weight: 600;
          color: #374151;
          border-bottom: 1px solid #e5e7eb;
        }
        .refund-table .ant-table-tbody > tr > td {
          padding: 12px 16px;
          border-bottom: 1px solid #f3f4f6;
        }
        .refund-table .ant-table-tbody > tr:hover > td {
          background: #f9fafb !important;
        }
        .refund-descriptions .ant-descriptions-item-label {
          background: #f9fafb !important;
          font-weight: 500;
          color: #6b7280;
          width: 140px;
        }
        .refund-descriptions .ant-descriptions-item-content {
          color: #111827;
        }
        .refund-drawer .ant-drawer-header {
          padding: 16px 20px;
        }
        .refund-drawer .ant-drawer-body {
          padding: 20px;
        }
        @media (max-width: 640px) {
          .refund-table .ant-table {
            font-size: 13px;
          }
          .refund-table .ant-table-thead > tr > th,
          .refund-table .ant-table-tbody > tr > td {
            padding: 10px 12px;
          }
          .refund-descriptions .ant-descriptions-item-label {
            width: 120px;
          }
        }
      `}</style>
    </div>
  )
}
