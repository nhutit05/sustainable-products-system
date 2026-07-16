import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Spin } from 'antd'
import {
  ReloadOutlined,
  FileTextOutlined,
  CloudUploadOutlined,
  BarChartOutlined,
  FilterOutlined,
  TableOutlined,
} from '@ant-design/icons'

import UploadCard from '../../components/knowledge/UploadCard'
import StatisticCards from '../../components/knowledge/StatisticCards'
import KnowledgeToolbar from '../../components/knowledge/KnowledgeToolbar'
import DocumentTable from '../../components/knowledge/DocumentTable'
import KnowledgeDetailDrawer from '../../components/knowledge/KnowledgeDetailDrawer'

import { getDocument, getDocuments, getStatistics, deleteDocument } from '../../services/knowledge.service'

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

  const handleDelete = useCallback(
    async (documentId: string) => {
      await deleteDocument(token, documentId)
      setDocuments((prev) => prev.filter((d) => d.documentId !== documentId))
      setTotal((prev) => prev - 1)
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
    <div className="min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-5 sm:space-y-6">

        {/* ================= HERO HEADER ================= */}
        <header className="relative overflow-hidden rounded-3xl"
          style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)' }}
        >
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-white/5 blur-xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
          </div>

          <div className="relative px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                  <CloudUploadOutlined className="text-white text-2xl sm:text-3xl" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white m-0 tracking-tight">
                    Knowledge Base
                  </h1>
                  <p className="text-emerald-100 text-sm sm:text-base mt-1 sm:mt-2 m-0 max-w-xl">
                    Quản lý và tổ chức tài liệu huấn luyện cho chatbot AI
                  </p>
                  <div className="flex items-center gap-4 mt-3 sm:mt-4">
                    <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                      <span className="text-white/90 text-xs font-medium">
                        {statistics?.totalDocuments ?? 0} tài liệu
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1.5">
                      <div className="w-2 h-2 rounded-full bg-blue-300" />
                      <span className="text-white/90 text-xs font-medium">
                        {statistics?.totalChunks ?? 0} chunks
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={refreshData}
                disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/20 backdrop-blur-sm text-sm font-medium text-white hover:bg-white/30 active:bg-white/40 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 cursor-pointer border border-white/20"
              >
                <ReloadOutlined className={`text-sm ${loading ? 'animate-spin' : ''}`} />
                <span>Làm mới</span>
              </button>
            </div>
          </div>
        </header>

        {/* ================= UPLOAD SECTION ================= */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
              <CloudUploadOutlined className="text-emerald-600 text-sm" />
            </div>
            <h2 className="text-base font-semibold text-gray-800 m-0">Tải lên tài liệu</h2>
          </div>
          <UploadCard refreshData={refreshData} />
        </section>

        {/* ================= STATISTICS SECTION ================= */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <BarChartOutlined className="text-blue-600 text-sm" />
            </div>
            <h2 className="text-base font-semibold text-gray-800 m-0">Thống kê tổng quan</h2>
          </div>
          <StatisticCards statistics={statistics} />
        </section>

        {/* ================= DOCUMENTS SECTION ================= */}
        <section>
          {/* Section Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                <TableOutlined className="text-purple-600 text-sm" />
              </div>
              <h2 className="text-base font-semibold text-gray-800 m-0">Quản lý tài liệu</h2>
            </div>
            {tableSummary && (
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
                <span>Hiển thị</span>
                <span className="font-semibold text-emerald-600">{tableSummary.from}–{tableSummary.to}</span>
                <span>trên</span>
                <span className="font-semibold text-emerald-600">{tableSummary.total}</span>
              </div>
            )}
          </div>

          {/* Toolbar */}
          <div className="mb-4">
            <KnowledgeToolbar
              keyword={keyword}
              statusFilter={statusFilter}
              onKeywordChange={setKeyword}
              onStatusChange={setStatusFilter}
              onRefresh={refreshData}
            />
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}
          >
            {/* Table Header */}
            <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100">
                    <FileTextOutlined className="text-emerald-600 text-sm" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800 m-0">Danh sách tài liệu</h3>
                    {tableSummary && (
                      <p className="text-xs text-gray-400 mt-0.5 m-0">
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
                onDelete={handleDelete}
                onView={handleView}
                currentPage={currentPage}
                pageSize={pageSize}
                total={total}
                onPageChange={handlePageChange}
              />
            </div>
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
