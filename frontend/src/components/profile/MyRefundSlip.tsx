import { useEffect, useMemo, useState } from 'react'
import { useCustomer } from '../../context/useCustomer'

import {
  ChevronLeft,
  ChevronRight,
  Wallet,
  Clock,
  Banknote,
  XCircle,
  ReceiptText,
  ArrowRight,
} from 'lucide-react'
import {
  RefundSlipStatusColor,
  RefundSlipStatusIcon,
  RefundSlipStatusName,
  type RefundSlipStatusType,
} from '../../enum/RefundSlip.enum'
import type { RefundSlipResponse } from '../../types/refundslip'
import RefundDetail from './RefundDetail'

const PAGE_SIZE = 4

type FilterValue = 'ALL' | RefundSlipStatusType

export default function MyRefund() {
  const { token } = useCustomer()

  const [loading, setLoading] = useState<boolean>(false)
  const [refunds, setRefunds] = useState<RefundSlipResponse[]>([])
  const [selectedStatus, setSelectedStatus] = useState<FilterValue>('ALL')
  const [currentPage, setCurrentPage] = useState<number>(1)

  const [onClose, setOnClose] = useState<boolean>(false)
  const [selectedRefund, setSelectedRefund] = useState<RefundSlipResponse | null>(null)

  const filters: { value: FilterValue; label: string }[] = [
    { value: 'ALL', label: 'Tất cả' },
    { value: 'PENDING', label: RefundSlipStatusName.PENDING },
    { value: 'APPROVED', label: RefundSlipStatusName.APPROVED },
    { value: 'REFUNDED', label: RefundSlipStatusName.REFUNDED },
    { value: 'REJECTED', label: RefundSlipStatusName.REJECTED },
  ]

  useEffect(() => {
    const fetchRefunds = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/refund-slips', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        if (!response.ok) {
          throw new Error('Failed to fetch refund slips')
        }
        const data = await response.json()
        setRefunds(data)
      } catch (error) {
        console.error('Error fetching refund slips:', error)
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchRefunds()
    }
  }, [token])

  const formatted = (dateString: string) =>
    new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Ho_Chi_Minh',
    }).format(new Date(dateString))

  // STATS
  const stats = useMemo(() => {
    const pending = refunds.filter((r) => r.refundStatusName === 'PENDING').length
    const refunded = refunds.filter((r) => r.refundStatusName === 'REFUNDED').length
    const rejected = refunds.filter((r) => r.refundStatusName === 'REJECTED').length
    return {
      total: refunds.length,
      pending,
      refunded,
      rejected,
    }
  }, [refunds])

  const resultFilter = useMemo(() => {
    if (selectedStatus === 'ALL') return refunds
    return refunds.filter((r) => r.refundStatusName === selectedStatus)
  }, [refunds, selectedStatus])

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(resultFilter.length / PAGE_SIZE)),
    [resultFilter]
  )

  const filteredRefunds = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE
    return resultFilter.slice(startIndex, startIndex + PAGE_SIZE)
  }, [resultFilter, currentPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedStatus])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [totalPages, currentPage])

  const handleShowDetail = (refund: RefundSlipResponse) => {
    setSelectedRefund(refund)
    setOnClose(true)
  }

  return (
    <div className="myRefund text-left">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-2 mb-4">
        <h2 className="text-green-900 text-lg sm:text-xl font-bold">
          Yêu cầu hoàn tiền
          <span className="ml-2 text-sm text-emerald-500 font-medium">
            ({refunds.length} yêu cầu)
          </span>
        </h2>
      </div>

      {/* STATS SUMMARY */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-2 mb-5">
        <div className="rounded-2xl border border-emerald-100 bg-white p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
            <ReceiptText className="w-4.5 h-4.5 text-emerald-600" />
          </div>
          <div className="min-w-0">
            <p className="text-lg font-bold text-green-900 leading-tight">{stats.total}</p>
            <p className="text-xs text-gray-500 truncate">Tổng yêu cầu</p>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-100 bg-white p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <Clock className="w-4.5 h-4.5 text-amber-600" />
          </div>
          <div className="min-w-0">
            <p className="text-lg font-bold text-green-900 leading-tight">{stats.pending}</p>
            <p className="text-xs text-gray-500 truncate">Đang chờ xử lý</p>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-white p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
            <Banknote className="w-4.5 h-4.5 text-emerald-600" />
          </div>
          <div className="min-w-0">
            <p className="text-lg font-bold text-green-900 leading-tight">{stats.refunded}</p>
            <p className="text-xs text-gray-500 truncate">Đã hoàn tiền</p>
          </div>
        </div>

        <div className="rounded-2xl border border-red-100 bg-white p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
            <XCircle className="w-4.5 h-4.5 text-red-500" />
          </div>
          <div className="min-w-0">
            <p className="text-lg font-bold text-green-900 leading-tight">{stats.rejected}</p>
            <p className="text-xs text-gray-500 truncate">Đã từ chối</p>
          </div>
        </div>
      </div>

      {/* FILTER */}
      <div className="refundStatusFilter flex flex-wrap gap-2 p-2 mb-1">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setSelectedStatus(filter.value)}
            className={`text-sm px-4 py-1.5 font-semibold rounded-full border transition-all duration-200
              hover:scale-102 active:scale-97 cursor-pointer
              ${
                selectedStatus === filter.value
                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                  : 'border-emerald-300 text-emerald-700 bg-white hover:bg-emerald-50'
              }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-48 gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-green-800">Đang tải yêu cầu hoàn tiền...</p>
        </div>
      ) : filteredRefunds.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 px-4 text-center">
          <div className="bg-emerald-50 border border-emerald-100 rounded-full p-4">
            <Wallet className="w-8 h-8 text-emerald-500" />
          </div>
          <p className="text-green-900 font-semibold">Chưa có yêu cầu hoàn tiền nào</p>
          <p className="text-sm text-gray-500">Các yêu cầu hoàn tiền của bạn sẽ xuất hiện ở đây.</p>
        </div>
      ) : (
        // TIMELINE-STYLE FEED (khác biệt với layout dạng card của MyOrder)
        <div className="refundList relative flex flex-col px-2">
          {filteredRefunds.map((refund, index) => {
            const StatusIcon = RefundSlipStatusIcon[refund.refundStatusName]
            const isLast = index === filteredRefunds.length - 1

            return (
              <div key={refund.refundSlipId} className="relative flex gap-4 pb-6 last:pb-0">
                {/* connector line */}
                {!isLast && (
                  <span className="absolute left-4.75 top-10 bottom-0 w-0.5 bg-emerald-100" />
                )}

                {/* node */}
                <span
                  className={
                    RefundSlipStatusColor[refund.refundStatusName] +
                    ' relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 bg-white shrink-0'
                  }
                >
                  <StatusIcon className="w-4.5 h-4.5" />
                </span>

                {/* content card */}
                <div
                  className="flex-1 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm
                  hover:shadow-md hover:border-emerald-200 transition-all duration-300"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        Mã yêu cầu{' '}
                        <span className="text-green-900 font-bold">#{refund.refundSlipId}</span>{' '}
                        <span className="text-xs text-gray-400 font-medium">
                          · Đơn #{refund.orderId}
                        </span>
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{formatted(refund.createdAt)}</p>
                    </div>

                    <span
                      className={
                        RefundSlipStatusColor[refund.refundStatusName] +
                        ' border px-2.5 py-1 rounded-xl text-xs font-semibold shrink-0'
                      }
                    >
                      {RefundSlipStatusName[refund.refundStatusName]}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mt-2.5 line-clamp-2">{refund.reason}</p>

                  <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-emerald-50">
                    <p className="text-xs text-gray-500">
                      Ngân hàng:{' '}
                      <span className="font-semibold text-gray-700">{refund.bankName}</span>
                    </p>
                    <button
                      onClick={() => handleShowDetail(refund)}
                      className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 cursor-pointer text-xs
                      text-white font-bold hover:scale-102 active:scale-97 transition-all duration-200 py-2 px-4 rounded-xl"
                    >
                      Xem chi tiết
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* PAGINATION */}
      {!loading && resultFilter.length > 0 && (
        <div className="flex flex-wrap justify-between items-center gap-2 mt-3 px-2">
          <p className="text-sm text-gray-500">
            Hiển thị {filteredRefunds.length} / {resultFilter.length} yêu cầu
          </p>

          {totalPages > 1 && (
            <div className="pagination flex items-center gap-1.5">
              <button
                className="flex items-center justify-center w-8 h-8 rounded-full border border-emerald-300
                text-emerald-600 hover:bg-emerald-50 disabled:opacity-40 disabled:cursor-not-allowed
                disabled:hover:bg-transparent transition-all"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, index) => {
                const page = index + 1
                const isActive = currentPage === page

                return (
                  <button
                    key={page}
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-all
                      ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                          : 'border border-emerald-300 text-emerald-600 hover:bg-emerald-50'
                      }`}
                    onClick={() => setCurrentPage(page)}
                    disabled={isActive}
                  >
                    {page}
                  </button>
                )
              })}

              <button
                className="flex items-center justify-center w-8 h-8 rounded-full border border-emerald-300
                text-emerald-600 hover:bg-emerald-50 disabled:opacity-40 disabled:cursor-not-allowed
                disabled:hover:bg-transparent transition-all"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* MODAL SHOW DETAIL */}
      {selectedRefund && onClose && (
        <RefundDetail refund={selectedRefund} setOnClose={setOnClose} />
      )}
    </div>
  )
}
