import { useState } from 'react'
import { FileSpreadsheet, FileText } from 'lucide-react'
import { message } from 'antd'
import { exportReport } from '../../services/statistics.service'
import type { ReportType, ExportFormat } from '../../model/statistics.model'

interface Props {
  activeTab: ReportType
}

const TAB_TO_REPORT: Record<string, ReportType> = {
  overview: 'all',
  revenue: 'revenue-by-category',
  products: 'top-products',
  customers: 'top-customers',
  reviews: 'reviews',
  vouchers: 'vouchers',
}

export default function ExportButtons({ activeTab }: Props) {
  const [loading, setLoading] = useState(false)

  const handleExport = async (format: ExportFormat) => {
    const token = localStorage.getItem('token') ?? ''
    if (!token) {
      message.error('Phiên đăng nhập đã hết hạn.')
      return
    }

    const report = TAB_TO_REPORT[activeTab] ?? 'all'
    setLoading(true)
    try {
      const blob = await exportReport(token, format, report)
      const url = window.URL.createObjectURL(new Blob([blob]))
      const link = document.createElement('a')
      link.href = url
      const ext = format === 'excel' ? 'xlsx' : 'pdf'
      link.setAttribute('download', `bao-cao-re-green.${ext}`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      message.success(`Xuất báo cáo ${format.toUpperCase()} thành công!`)
    } catch {
      message.error('Không thể xuất báo cáo. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleExport('excel')}
        disabled={loading}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm font-medium hover:bg-emerald-100 active:bg-emerald-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        <FileSpreadsheet size={15} />
        Excel
      </button>
      <button
        onClick={() => handleExport('pdf')}
        disabled={loading}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-sm font-medium hover:bg-rose-100 active:bg-rose-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        <FileText size={15} />
        PDF
      </button>
    </div>
  )
}
