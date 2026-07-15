import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Spin } from 'antd'
import { ReloadOutlined, FileTextOutlined } from '@ant-design/icons'

import UploadCard from '../../components/knowledge/UploadCard'
import StatisticCards from '../../components/knowledge/StatisticCards'
import KnowledgeToolbar from '../../components/knowledge/KnowledgeToolbar'
import DocumentTable from '../../components/knowledge/DocumentTable'
import KnowledgeDetailDrawer from '../../components/knowledge/KnowledgeDetailDrawer'

import { getDocument, getDocuments, getStatistics } from '../../services/knowledge.service'

import type {
  KnowledgeDocument,
  KnowledgeDocumentDetail,
  KnowledgeStatistics,
} from '../../types/knowledge'

const KnowledgePage = () => {
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([])
  const [statistics, setStatistics] = useState<KnowledgeStatistics>()
  const [loading, setLoading] = useState(false)
  const token = localStorage.getItem('token') ?? ''

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<KnowledgeDocumentDetail>()

  const [keyword, _setKeyword] = useState('')
  const [statusFilter, _setStatusFilter] = useState('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)

  const abortRef = useRef<AbortController | null>(null)

  const setKeyword = useCallback((value: string) => {
    _setKeyword(value)
    setCurrentPage(1)
  }, [])

  const setStatusFilter = useCallback((value: string) => {
    _setStatusFilter(value)
    setCurrentPage(1)
  }, [])

  const refreshData = useCallback(async () => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)
    try {
      const [pageResponse, statistic] = await Promise.all([
        getDocuments(token, currentPage - 1, pageSize, keyword, statusFilter),
        getStatistics(token),
      ])

      if (!controller.signal.aborted) {
        setDocuments(pageResponse.content)
        setTotal(pageResponse.totalElements)
        setStatistics(statistic)
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        console.error(err)
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false)
      }
    }
  }, [token, currentPage, pageSize, keyword, statusFilter])

  const handleView = useCallback(
    async (documentId: string) => {
      try {
        const data = await getDocument(token, documentId)
        setSelectedDocument(data)
        setDrawerOpen(true)
      } catch (error) {
        console.error(error)
      }
    },
    [token]
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      refreshData()
    }, 400)
    return () => clearTimeout(timer)
  }, [keyword, statusFilter, currentPage, pageSize, refreshData])

  const handlePageChange = useCallback((page: number, size: number) => {
    setCurrentPage(page)
    setPageSize(size)
  }, [])

  const tableSummary = useMemo(() => {
    if (total === 0) return null
    const from = (currentPage - 1) * pageSize + 1
    const to = Math.min(currentPage * pageSize, total)
    return { from, to, total }
  }, [currentPage, pageSize, total])

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-5 lg:space-y-6">
        {/* ================= HEADER ================= */}
        <header className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4 sm:px-6 sm:py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                Knowledge Base
              </h1>
              <p className="text-sm text-gray-400 mt-0.5 truncate">
                Quản lý tài liệu huấn luyện cho chatbot
              </p>
            </div>
            <button
              onClick={refreshData}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 active:bg-gray-100 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 cursor-pointer"
            >
              <ReloadOutlined className={`text-sm ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden xs:inline">Làm mới</span>
              <span className="xs:hidden">Refresh</span>
            </button>
          </div>
        </header>

        {/* ================= UPLOAD ================= */}
        <UploadCard refreshData={refreshData} />

        {/* ================= STATS ================= */}
        <StatisticCards statistics={statistics} />

        {/* ================= TOOLBAR ================= */}
        <KnowledgeToolbar
          keyword={keyword}
          statusFilter={statusFilter}
          onKeywordChange={setKeyword}
          onStatusChange={setStatusFilter}
          onRefresh={refreshData}
        />

        {/* ================= TABLE SECTION ================= */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Table Header */}
          <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50">
                  <FileTextOutlined className="text-emerald-600 text-sm" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900">Danh sách tài liệu</h2>
                  {tableSummary && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      Hiển thị {tableSummary.from}–{tableSummary.to} / {tableSummary.total} tài liệu
                    </p>
                  )}
                </div>
              </div>

              {loading && (
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Spin size="small" />
                  <span>Đang tải...</span>
                </div>
              )}
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <DocumentTable
              documents={documents}
              loading={loading}
              refreshData={refreshData}
              onView={handleView}
              currentPage={currentPage}
              pageSize={pageSize}
              total={total}
              onPageChange={handlePageChange}
            />
          </div>
        </section>

        {/* ================= DETAIL DRAWER ================= */}
        <KnowledgeDetailDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          document={selectedDocument}
        />
      </div>
    </div>
  )
}

export default memo(KnowledgePage)
