import { Modal } from 'antd'
import {
  X,
  Calendar,
  Hash,
  Landmark,
  MessageSquareText,
  Clock,
  CheckCircle2,
  XCircle,
  Banknote,
  History,
} from 'lucide-react'
import type { RefundSlipResponse } from '../../types/refundslip'
import { RefundSlipStatusColor, RefundSlipStatusName } from '../../enum/RefundSlip.enum'

interface RefundDetailProps {
  refund: RefundSlipResponse
  setOnClose: (value: boolean) => void
}

const STEPS = [
  { key: 'PENDING', label: 'Đang chờ xử lý', icon: Clock },
  { key: 'APPROVED', label: 'Đã duyệt', icon: CheckCircle2 },
  { key: 'REFUNDED', label: 'Đã hoàn tiền', icon: Banknote },
] as const

export default function RefundDetail({ refund, setOnClose }: RefundDetailProps) {
  const formatted = (dateString: string) =>
    new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Ho_Chi_Minh',
    }).format(new Date(dateString))

  const isRejected = refund.refundStatusName === 'REJECTED'
  const activeStepIndex = isRejected ? 1 : STEPS.findIndex((s) => s.key === refund.refundStatusName)

  return (
    <div className="refundDetail">
      <Modal
        open={true}
        onCancel={() => setOnClose(false)}
        footer={null}
        closeIcon={
          <span className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-all">
            <X className="w-4 h-4 text-gray-500" />
          </span>
        }
        centered
        width={640}
        className="refund-detail-modal"
      >
        <div className="pt-1">
          {/* HEADER */}
          <div className="flex items-center justify-between gap-3 pb-4 mb-5 border-b border-emerald-100">
            <div>
              <p className="text-xs font-semibold text-emerald-500 uppercase tracking-wider mb-1">
                Chi tiết yêu cầu hoàn tiền
              </p>
              <h2 className="text-xl font-bold text-green-900">
                #{refund.refundSlipId}{' '}
                <span className="text-sm font-medium text-gray-400">· Đơn #{refund.orderId}</span>
              </h2>
              <p className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
                <Calendar className="w-3.5 h-3.5" />
                {formatted(refund.createdAt)}
              </p>
            </div>

            <span
              className={
                RefundSlipStatusColor[refund.refundStatusName] +
                ' border px-3 py-1.5 rounded-xl text-xs font-bold shrink-0'
              }
            >
              {RefundSlipStatusName[refund.refundStatusName]}
            </span>
          </div>

          {/* STEPPER / TIMELINE */}
          <div className="mb-6 px-1">
            {isRejected ? (
              <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50/60 px-4 py-3">
                <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                <p className="text-sm font-semibold text-red-700">
                  Yêu cầu hoàn tiền đã bị từ chối
                </p>
              </div>
            ) : (
              <div className="flex items-center">
                {STEPS.map((step, index) => {
                  const StepIcon = step.icon
                  const isDone = index < activeStepIndex
                  const isActive = index === activeStepIndex
                  const isFuture = index > activeStepIndex

                  return (
                    <div key={step.key} className="flex items-center flex-1 last:flex-none">
                      <div className="flex flex-col items-center gap-1.5 shrink-0">
                        <div
                          className={`flex items-center justify-center w-9 h-9 rounded-full border-2 transition-all duration-300 ${
                            isDone
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : isActive
                                ? 'bg-white border-emerald-500 text-emerald-600 shadow-sm shadow-emerald-200 animate-pulse'
                                : 'bg-gray-50 border-gray-200 text-gray-300'
                          }`}
                        >
                          <StepIcon className="w-4 h-4" />
                        </div>
                        <span
                          className={`text-[11px] font-semibold text-center max-w-20 ${
                            isFuture ? 'text-gray-300' : 'text-gray-700'
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>

                      {index < STEPS.length - 1 && (
                        <div
                          className={`flex-1 h-0.5 mx-1.5 -mt-5 rounded-full transition-all duration-300 ${
                            index < activeStepIndex ? 'bg-emerald-500' : 'bg-gray-200'
                          }`}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* MAIN GRID: ORDER REF + BANK INFO */}
          <div className="grid sm:grid-cols-2 gap-3 mb-5">
            {/* Order reference */}
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4">
              <h3 className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wide mb-3">
                <Hash className="w-4 h-4" />
                Đơn hàng liên quan
              </h3>
              <p className="text-sm text-gray-600">
                Mã đơn hàng: <span className="font-semibold text-gray-800">#{refund.orderId}</span>
              </p>
              <p className="flex items-center gap-1.5 text-sm text-gray-600 mt-2.5">
                <History className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                Cập nhật lần cuối: {formatted(refund.updatedAt)}
              </p>
            </div>

            {/* Bank info */}
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4">
              <h3 className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wide mb-3">
                <Landmark className="w-4 h-4" />
                Nhận hoàn tiền
              </h3>
              <p className="text-sm text-gray-600">
                Ngân hàng: <span className="font-semibold text-gray-800">{refund.bankName}</span>
              </p>
              <p className="text-sm text-gray-600 mt-1.5">
                Số tài khoản:{' '}
                <span className="font-semibold text-gray-800">{refund.bankNumber}</span>
              </p>
              <p className="text-sm text-gray-600 mt-1.5">
                Chủ tài khoản:{' '}
                <span className="font-semibold text-gray-800">{refund.accountBankName}</span>
              </p>
            </div>
          </div>

          {/* REASON */}
          <div className="rounded-2xl border border-emerald-100 p-4">
            <h3 className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wide mb-2">
              <MessageSquareText className="w-4 h-4" />
              Lý do hoàn tiền
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">{refund.reason}</p>
          </div>
        </div>
      </Modal>
    </div>
  )
}
