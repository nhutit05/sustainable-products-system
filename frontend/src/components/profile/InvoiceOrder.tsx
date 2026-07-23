import { useState, useRef } from 'react'
import { Modal } from 'antd'
import { toPng } from 'html-to-image'
import {
  Download,
  CheckCircle2,
  Leaf,
  Calendar,
  User,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
} from 'lucide-react'
import type { OrderResponse } from '../../model/checkout.model'

interface InvoiceModalProps {
  order: OrderResponse
  setOnClose: (value: boolean) => void
}

export default function InvoiceModal({ order, setOnClose }: InvoiceModalProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const invoiceRef = useRef<HTMLDivElement>(null)

  // Hàm xử lý Tải hóa đơn dạng Ảnh (PNG)
  const handleDownloadImage = async () => {
    if (!invoiceRef.current) return
    try {
      setIsDownloading(true)
      const dataUrl = await toPng(invoiceRef.current, { cacheBust: true, quality: 0.95 })
      const link = document.createElement('a')
      link.download = `Hoa-Don-ReGreen-${order?.orderId || 'EC'}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Lỗi khi tải ảnh hóa đơn:', err)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Modal
      open={true}
      onCancel={() => setOnClose(false)}
      footer={null}
      centered
      destroyOnClose
      width={540}
      styles={{
        body: {
          padding: 0,
          maxHeight: '90vh',
          overflowY: 'auto',
        },
      }}
      style={{
        top: 20,
      }}
    >
      <div className="p-6 md:p-8 bg-white">
        {/* KHU VỰC IN / CHỤP ẢNH HÓA ĐƠN */}
        <div
          ref={invoiceRef}
          className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm relative"
        >
          {/* Header Thương hiệu ReGreen */}
          <div className="flex justify-between items-start border-b border-dashed border-emerald-200 pb-5 mb-6">
            <div>
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-3xl tracking-tight">
                <div className="w-9 h-9 bg-emerald-600 text-white rounded-full flex items-center justify-center font-black text-lg shadow-sm">
                  🌿
                </div>
                ReGreen
              </div>
              <p className="text-xs text-emerald-800/70 font-medium mt-1">
                Sản phẩm xanh - Môi trường xanh
              </p>
            </div>

            <div className="text-right">
              <span className="inline-block px-3 py-1 text-xs font-bold bg-emerald-100/80 text-emerald-800 rounded-full">
                HÓA ĐƠN BÁN HÀNG
              </span>
              <p className="text-sm text-gray-500 mt-2 font-mono font-semibold">#{order.orderId}</p>
            </div>
          </div>

          {/* Thông tin đơn hàng & Khách hàng */}
          <div className="grid grid-cols-2 gap-4 text-sm mb-6 bg-emerald-50/40 p-4 rounded-xl border border-emerald-100/60">
            <div className="flex items-center gap-3 text-gray-700">
              <div className="p-2.5 bg-emerald-100/60 text-emerald-700 rounded-lg shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Khách hàng</p>
                <p className="font-bold text-gray-800 text-base">
                  {order.customerUsername || 'Khách hàng'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <div className="p-2.5 bg-emerald-100/60 text-emerald-700 rounded-lg shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Ngày đặt hàng</p>
                <p className="font-bold text-gray-800 text-base">
                  {order.orderedAt ? new Date(order.orderedAt).toLocaleDateString('vi-VN') : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Chi tiết tính tiền */}
          <div className="space-y-3.5 text-sm border-b border-dashed border-gray-200 pb-5 mb-5">
            <div className="flex justify-between items-center text-gray-600 text-base">
              <span className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-emerald-600" />
                Tiền hàng
              </span>
              <span className="font-semibold text-gray-800">
                {Number(order.totalAmount || 0).toLocaleString('vi-VN')} đ
              </span>
            </div>

            <div className="flex justify-between items-center text-gray-600 text-base">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Giao hàng Eco-friendly
              </span>
              <span className="text-emerald-700 font-bold bg-emerald-100/70 px-2.5 py-0.5 rounded-md text-xs">
                Miễn phí
              </span>
            </div>
          </div>

          {/* Tổng cộng thanh toán */}
          <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/20 mb-5 flex justify-between items-center">
            <div>
              <p className="text-sm text-emerald-900 font-semibold">Tổng thanh toán</p>
              <p className="text-xs text-emerald-700/80">Đã bao gồm VAT</p>
            </div>
            <span className="text-2xl font-black text-emerald-700">
              {Number(order.totalAmount || 0).toLocaleString('vi-VN')} đ
            </span>
          </div>

          {/* Tác động môi trường */}
          <div className="flex items-center gap-2.5 text-xs text-emerald-900 bg-emerald-50 p-3 rounded-xl border border-emerald-100 mb-5">
            <Leaf className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Đơn hàng điện tử này giúp tiết kiệm <b className="text-emerald-700">0.05kg CO2</b> ra
              môi trường.
            </span>
          </div>

          {/* Footer Hóa đơn */}
          <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-100 pt-3.5">
            <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Thanh toán thành công</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-gray-400" />
              <span>Bảo mật ReGreen</span>
            </div>
          </div>
        </div>

        {/* NÚT BẤM TẢI HÓA ĐƠN */}
        <div className="mt-6">
          <button
            onClick={handleDownloadImage}
            disabled={isDownloading}
            className="w-full py-4 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-base rounded-2xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2.5 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-5 h-5" />
            {isDownloading ? 'Đang tạo ảnh hóa đơn...' : 'Tải Hóa Đơn Về Máy (PNG)'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
