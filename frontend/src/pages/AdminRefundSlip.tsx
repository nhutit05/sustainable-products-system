import React, { useEffect, useState } from "react"
import {
  CheckCircle,
  X,
  Eye,
  Search,
  RotateCw,
  Wallet,
} from "lucide-react"
import {
  Table,
  Tag,
  Button,
  Input,
  Select,
  DatePicker,
  Space,
  Spin,
  message,
  Popconfirm,
  Pagination,
  Drawer,
  Descriptions,
} from "antd"
import type { ColumnsType } from "antd/es/table"
import dayjs from "dayjs"

import type { RefundSlipResponse } from "../types/refundslip"
import { useNotification } from "../context/useNotification"

const { RangePicker } = DatePicker

function formatDate(value: unknown): string {
  if (!value) return "-"
  try {
    if (Array.isArray(value)) {
      const [y, m, d, h = 0, mi = 0, s = 0] = value
      return dayjs(new Date(y, m - 1, d, h, mi, s)).format("DD/MM/YYYY HH:mm")
    }
    return dayjs(value as string).format("DD/MM/YYYY HH:mm")
  } catch {
    return "-"
  }
}

export default function AdminRefundSlip() {
  const token = localStorage.getItem("token")
  const { showNotification } = useNotification()

  const [refundSlips, setRefundSlips] = useState<RefundSlipResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
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
    { value: "", label: "Tất cả" },
    { value: "PENDING", label: "Đang chờ xử lý" },
    { value: "APPROVED", label: "Đã duyệt" },
    { value: "REJECTED", label: "Đã từ chối" },
    { value: "REFUNDED", label: "Đã hoàn tiền" },
  ]

  const statusMap: Record<string, { color: string; label: string }> = {
    PENDING: { color: "orange", label: "Đang chờ xử lý" },
    APPROVED: { color: "blue", label: "Đã duyệt" },
    REJECTED: { color: "red", label: "Đã từ chối" },
    REFUNDED: { color: "green", label: "Đã hoàn tiền" },
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 300)
    return () => clearTimeout(timeout)
  }, [searchQuery])

  const fetchRefundSlips = async () => {
    if (!token) return
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (debouncedSearch) params.append("search", debouncedSearch)
      if (selectedStatus) params.append("status", selectedStatus)
      params.append("page", (currentPage - 1).toString())
      params.append("size", pageSize.toString())
      if (dateRange) {
        params.append("startDate", dayjs(dateRange[0]).format("YYYY-MM-DD"))
        params.append("endDate", dayjs(dateRange[1]).format("YYYY-MM-DD"))
      }
      const response = await fetch(
        `http://localhost:8080/api/admin/refund-slips?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (response.ok) {
        const data = await response.json()
        setRefundSlips(data.content)
        setTotalElements(data.totalElements)
        setTotalPages(data.totalPages)
      } else {
        message.error("Không thể tải danh sách yêu cầu hoàn tiền.")
      }
    } catch {
      message.error("Có lỗi xảy ra khi tải danh sách.")
    } finally {
      setLoading(false)
    }
  }

  const fetchRefundSlipDetail = async (refundSlipId: number) => {
    if (!token) return
    setDetailLoading(true)
    setDrawerOpen(true)
    try {
      const response = await fetch(
        `http://localhost:8080/api/admin/refund-slips/${refundSlipId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (response.ok) {
        const data = await response.json()
        setSelectedRefundSlip(data)
      } else {
        message.error("Không thể tải chi tiết yêu cầu hoàn tiền.")
        setSelectedRefundSlip(null)
        setDrawerOpen(false)
      }
    } catch {
      message.error("Có lỗi xảy ra khi tải chi tiết.")
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
        { method: "PATCH", headers: { Authorization: `Bearer ${token}` } }
      )
      if (response.ok) {
        showNotification({ message: "Duyệt yêu cầu hoàn tiền thành công", type: "SUCCESS", duration: 3000 })
        fetchRefundSlips()
        if (selectedRefundSlip?.refundSlipId === refundSlipId) fetchRefundSlipDetail(refundSlipId)
      } else {
        const err = await response.json()
        message.error(err.message || "Không thể duyệt yêu cầu hoàn tiền.")
      }
    } catch {
      message.error("Có lỗi xảy ra khi duyệt yêu cầu.")
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
        { method: "PATCH", headers: { Authorization: `Bearer ${token}` } }
      )
      if (response.ok) {
        showNotification({ message: "Từ chối yêu cầu hoàn tiền thành công", type: "SUCCESS", duration: 3000 })
        fetchRefundSlips()
        if (selectedRefundSlip?.refundSlipId === refundSlipId) fetchRefundSlipDetail(refundSlipId)
      } else {
        const err = await response.json()
        message.error(err.message || "Không thể từ chối yêu cầu hoàn tiền.")
      }
    } catch {
      message.error("Có lỗi xảy ra khi từ chối yêu cầu.")
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
        { method: "PATCH", headers: { Authorization: `Bearer ${token}` } }
      )
      if (response.ok) {
        showNotification({ message: "Thực hiện hoàn tiền thành công", type: "SUCCESS", duration: 3000 })
        fetchRefundSlips()
        if (selectedRefundSlip?.refundSlipId === refundSlipId) fetchRefundSlipDetail(refundSlipId)
      } else {
        const err = await response.json()
        message.error(err.message || "Không thể thực hiện hoàn tiền.")
      }
    } catch {
      message.error("Có lỗi xảy ra khi thực hiện hoàn tiền.")
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
      title: "Mã yêu cầu",
      dataIndex: "refundSlipId",
      key: "refundSlipId",
      width: 100,
      render: (id) => `#${id}`,
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "orderId",
      key: "orderId",
      width: 100,
      render: (orderId) => `#${orderId}`,
    },
    {
      title: "Số tài khoản",
      dataIndex: "bankNumber",
      key: "bankNumber",
      width: 150,
    },
    {
      title: "Tên chủ tài khoản",
      dataIndex: "accountBankName",
      key: "accountBankName",
      width: 180,
    },
    {
      title: "Trạng thái",
      dataIndex: "refundStatusName",
      key: "refundStatusName",
      width: 140,
      render: (status: string) => {
        const cfg = statusMap[status] || statusMap.PENDING
        return <Tag color={cfg.color}>{cfg.label}</Tag>
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 160,
      render: (val) => formatDate(val),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 150,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<Eye size={16} />}
            onClick={() => fetchRefundSlipDetail(record.refundSlipId)}
            className="text-blue-500"
          />

          {record.refundStatusName === "PENDING" && (
            <>
              <Popconfirm
                title="Duyệt yêu cầu hoàn tiền này?"
                onConfirm={() => handleApprove(record.refundSlipId)}
                okText="Đồng ý"
                cancelText="Huỷ"
              >
                <Button type="text" icon={<CheckCircle size={16} />} className="text-green-500" loading={actionLoading} />
              </Popconfirm>
              <Popconfirm
                title="Từ chối yêu cầu hoàn tiền này?"
                onConfirm={() => handleReject(record.refundSlipId)}
                okText="Đồng ý"
                cancelText="Huỷ"
              >
                <Button type="text" danger icon={<X size={16} />} loading={actionLoading} />
              </Popconfirm>
            </>
          )}

          {record.refundStatusName === "APPROVED" && (
            <Popconfirm
              title="Xác nhận thực hiện hoàn tiền?"
              onConfirm={() => handleRefund(record.refundSlipId)}
              okText="Đồng ý"
              cancelText="Huỷ"
            >
              <Button type="text" icon={<Wallet size={16} />} className="text-purple-500" loading={actionLoading} />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div className="admin_refund-slip mt-20">
      {/* Header */}
      <header className="adm_refund-slip-header p-4 rounded-2xl shadow-md bg-white mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
          <h1 className="text-2xl font-semibold text-green-900">Xử lý hoàn tiền</h1>
          <Button icon={<RotateCw size={16} />} onClick={fetchRefundSlips}>
            Làm mới
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            placeholder="Tìm kiếm theo mã đơn, số tài khoản..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            prefix={<Search size={16} className="text-gray-400" />}
          />
          <Select
            placeholder="Trạng thái"
            value={selectedStatus}
            onChange={setSelectedStatus}
            options={statusOptions}
            allowClear
            className="w-full"
          />
          <RangePicker
            value={dateRange}
            onChange={setDateRange}
            format="DD/MM/YYYY"
            placeholder={["Từ ngày", "Đến ngày"]}
            className="w-full"
          />
          <Button
            onClick={() => {
              setSearchQuery("")
              setSelectedStatus(undefined)
              setDateRange(null)
            }}
            danger
          >
            Xóa bộ lọc
          </Button>
        </div>
      </header>

      {/* Table */}
      <main className="bg-white rounded-2xl shadow p-5">
        <Spin spinning={loading}>
          <div className="overflow-x-auto">
            <Table
              columns={columns}
              dataSource={refundSlips}
              rowKey="refundSlipId"
              pagination={false}
              scroll={{ x: 900 }}
            />
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <Pagination
                current={currentPage}
                total={totalElements}
                pageSize={pageSize}
                onChange={(page) => setCurrentPage(page)}
                showSizeChanger={false}
                showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} mục`}
              />
            </div>
          )}
        </Spin>
      </main>

      {/* Detail Drawer */}
      <Drawer
        title={
          selectedRefundSlip
            ? `Chi tiết yêu cầu hoàn tiền #${selectedRefundSlip.refundSlipId}`
            : "Chi tiết yêu cầu hoàn tiền"
        }
        width={600}
        open={drawerOpen}
        onClose={() => {
          if (actionLoading) return
          setDrawerOpen(false)
          setSelectedRefundSlip(null)
        }}
        destroyOnClose
      >
        {detailLoading ? (
          <Spin />
        ) : selectedRefundSlip ? (
          <div className="space-y-6">
            {/* Trạng thái */}
            <div className="rounded-xl border border-gray-200 p-4">
              <h3 className="font-semibold text-lg text-green-700 mb-4">Trạng thái</h3>
              <Tag
                color={statusMap[selectedRefundSlip.refundStatusName]?.color || "default"}
                className="text-base px-4 py-1"
              >
                {statusMap[selectedRefundSlip.refundStatusName]?.label || selectedRefundSlip.refundStatusName}
              </Tag>
            </div>

            {/* Thông tin đơn hàng */}
            <div className="rounded-xl border border-gray-200 p-4">
              <h3 className="font-semibold text-lg text-green-700 mb-4">Thông tin đơn hàng</h3>
              <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="Mã đơn hàng">#{selectedRefundSlip.orderId}</Descriptions.Item>
                <Descriptions.Item label="Lý do hoàn tiền">{selectedRefundSlip.reason || "-"}</Descriptions.Item>
              </Descriptions>
            </div>

            {/* Thông tin tài khoản ngân hàng */}
            <div className="rounded-xl border border-gray-200 p-4">
              <h3 className="font-semibold text-lg text-green-700 mb-4">Thông tin tài khoản ngân hàng</h3>
              <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="Ngân hàng">{selectedRefundSlip.bankName || selectedRefundSlip.bankId}</Descriptions.Item>
                <Descriptions.Item label="Số tài khoản">{selectedRefundSlip.bankNumber}</Descriptions.Item>
                <Descriptions.Item label="Tên chủ tài khoản">{selectedRefundSlip.accountBankName}</Descriptions.Item>
              </Descriptions>
            </div>

            {/* Thông tin thời gian */}
            <div className="rounded-xl border border-gray-200 p-4">
              <h3 className="font-semibold text-lg text-green-700 mb-4">Thông tin thời gian</h3>
              <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="Ngày tạo">{formatDate(selectedRefundSlip.createdAt)}</Descriptions.Item>
                <Descriptions.Item label="Cập nhật lần cuối">{formatDate(selectedRefundSlip.updatedAt)}</Descriptions.Item>
              </Descriptions>
            </div>

            {/* Hành động */}
            {selectedRefundSlip.refundStatusName === "PENDING" && (
              <div className="flex gap-3">
                <Popconfirm
                  title="Duyệt yêu cầu hoàn tiền này?"
                  onConfirm={() => handleApprove(selectedRefundSlip.refundSlipId)}
                  okText="Đồng ý"
                  cancelText="Huỷ"
                >
                  <Button type="primary" icon={<CheckCircle size={16} />} loading={actionLoading}>
                    Duyệt
                  </Button>
                </Popconfirm>
                <Popconfirm
                  title="Từ chối yêu cầu hoàn tiền này?"
                  onConfirm={() => handleReject(selectedRefundSlip.refundSlipId)}
                  okText="Đồng ý"
                  cancelText="Huỷ"
                >
                  <Button danger icon={<X size={16} />} loading={actionLoading}>
                    Từ chối
                  </Button>
                </Popconfirm>
              </div>
            )}

            {selectedRefundSlip.refundStatusName === "APPROVED" && (
              <Popconfirm
                title="Xác nhận thực hiện hoàn tiền?"
                onConfirm={() => handleRefund(selectedRefundSlip.refundSlipId)}
                okText="Đồng ý"
                cancelText="Huỷ"
              >
                <Button type="primary" icon={<Wallet size={16} />} loading={actionLoading}>
                  Thực hiện hoàn tiền
                </Button>
              </Popconfirm>
            )}
          </div>
        ) : null}
      </Drawer>
    </div>
  )
}
