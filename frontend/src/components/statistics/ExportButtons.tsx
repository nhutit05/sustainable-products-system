import { useState } from 'react'
import { FileSpreadsheet, FileText } from 'lucide-react'
import { message } from 'antd'
import { exportReport } from '../../services/statistics.service'
import type { ReportType, ExportFormat } from '../../model/statistics.model'

interface Props {
  activeTab: ReportType
  startDate?: string
  endDate?: string
}

const TAB_TO_REPORT: Record<string, ReportType> = {
  revenue: 'revenue-by-period',
  inventory: 'inventory-overview',
  orders: 'order-status',
  'top-products': 'top-products',
  'new-users': 'new-customers',
}

export default function ExportButtons({ activeTab, startDate, endDate }: Props) {
  const [loading, setLoading] = useState(false)

  const handleExport = async (format: ExportFormat) => {
    const token = localStorage.getItem('token') ?? ''
    if (!token) {
      message.error('Phien dang nhap da het han.')
      return
    }

    const report = TAB_TO_REPORT[activeTab] ?? 'all'
    setLoading(true)
    try {
      const blob = await exportReport(token, format, report, startDate, endDate)
      const url = window.URL.createObjectURL(new Blob([blob]))
      const link = document.createElement('a')
      link.href = url
      const ext = format === 'excel' ? 'xlsx' : 'pdf'
      link.setAttribute('download', `bao-cao-re-green.${ext}`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      message.success(`Xuat bao cao ${format.toUpperCase()} thanh cong!`)
    } catch {
      message.error('Khong the xuat bao cao. Vui long thu lai.')
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
