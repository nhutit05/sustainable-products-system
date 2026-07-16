import {
    Button,
    message,
    Popconfirm,
    Table,
    Tag,
    Tooltip,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
    DeleteOutlined,
    EyeOutlined,
    FilePdfOutlined,
    FileWordOutlined,
    CheckCircleOutlined,
    SyncOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    UploadOutlined,
} from '@ant-design/icons'

import type { KnowledgeDocument } from '../../types/knowledge'

interface DocumentTableProps {
    documents: KnowledgeDocument[]
    loading: boolean
    onDelete: (documentId: string) => Promise<void>
    onView: (documentId: string) => void
    currentPage: number
    pageSize: number
    total: number
    onPageChange: (page: number, pageSize: number) => void
}

export default function DocumentTable({
    documents,
    loading,
    onDelete,
    onView,
    currentPage,
    pageSize,
    total,
    onPageChange,
}: DocumentTableProps) {
    const handleDelete = async (documentId: string) => {
        try {
            await onDelete(documentId)
            message.success('Xóa tài liệu thành công')
        } catch (error) {
            console.error(error)
            message.error('Xóa tài liệu thất bại')
        }
    }

    const renderStatus = (status: string) => {
        const statusConfig: Record<string, { color: string; icon: React.ReactNode; bg: string }> = {
            EMBEDDED: {
                color: '#10b981',
                icon: <CheckCircleOutlined />,
                bg: 'bg-emerald-50',
            },
            CHUNKED: {
                color: '#3b82f6',
                icon: <SyncOutlined spin />,
                bg: 'bg-blue-50',
            },
            PARSED: {
                color: '#f59e0b',
                icon: <ClockCircleOutlined />,
                bg: 'bg-amber-50',
            },
            FAILED: {
                color: '#ef4444',
                icon: <CloseCircleOutlined />,
                bg: 'bg-red-50',
            },
            UPLOADED: {
                color: '#8b5cf6',
                icon: <UploadOutlined />,
                bg: 'bg-violet-50',
            },
        }

        const config = statusConfig[status] || { color: '#6b7280', icon: null, bg: 'bg-gray-50' }

        return (
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${config.bg}`}
                style={{ color: config.color, border: `1px solid ${config.color}20` }}
            >
                {config.icon}
                <span>{status}</span>
            </div>
        )
    }

    const columns: ColumnsType<KnowledgeDocument> = [
        {
            title: 'Tài liệu',
            key: 'document',
            render: (_, record) => (
                <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        record.documentType === 'PDF'
                            ? 'bg-gradient-to-br from-red-50 to-red-100 text-red-500'
                            : 'bg-gradient-to-br from-blue-50 to-blue-100 text-blue-500'
                    }`}>
                        {record.documentType === 'PDF' ? (
                            <FilePdfOutlined className="text-lg" />
                        ) : (
                            <FileWordOutlined className="text-lg" />
                        )}
                    </div>
                    <div className="min-w-0">
                        <div className="text-sm font-semibold text-gray-800 truncate max-w-[280px]">
                            {record.fileName}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                record.documentType === 'PDF'
                                    ? 'bg-red-50 text-red-600'
                                    : 'bg-blue-50 text-blue-600'
                            }`}>
                                {record.documentType}
                            </span>
                            <span className="text-xs text-gray-400">
                                {(record.fileSize / 1024).toFixed(1)} KB
                            </span>
                            <span className="text-gray-300">·</span>
                            <span className="text-xs text-gray-400">
                                {record.chunkCount} chunks
                            </span>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 160,
            render: renderStatus,
        },
        {
            title: 'Ngày tải lên',
            dataIndex: 'uploadedAt',
            key: 'uploadedAt',
            width: 160,
            render: (value: string) => {
                const date = new Date(value + 'Z')
                return (
                    <div className="text-sm">
                        <div className="text-gray-700 font-medium">
                            {date.toLocaleDateString('vi-VN')}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                            {date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                )
            },
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 140,
            render: (_, record) => (
                <div className="flex items-center gap-1.5">
                    <Tooltip title="Xem chi tiết">
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            onClick={() => onView(record.documentId)}
                            className="!w-9 !h-9 !rounded-lg !flex !items-center !justify-center hover:!bg-emerald-50 !text-emerald-600"
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Xóa tài liệu?"
                        description="Bạn có chắc chắn muốn xóa?"
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                        onConfirm={() => handleDelete(record.documentId)}
                    >
                        <Tooltip title="Xóa">
                            <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                className="!w-9 !h-9 !rounded-lg !flex !items-center !justify-center hover:!bg-red-50"
                            />
                        </Tooltip>
                    </Popconfirm>
                </div>
            ),
        },
    ]

    return (
        <Table
            rowKey="documentId"
            columns={columns}
            dataSource={documents}
            loading={loading}
            pagination={{
                current: currentPage,
                pageSize,
                total,
                showSizeChanger: true,
                pageSizeOptions: ['5', '10', '20', '50'],
                showTotal: (total) => (
                    <span className="text-sm text-gray-500">
                        Tổng <span className="font-semibold text-emerald-600">{total}</span> tài liệu
                    </span>
                ),
                onChange: onPageChange,
                className: '!px-4',
            }}
            rowClassName={() => 'hover:bg-emerald-50/50 transition-colors duration-150'}
            scroll={{ x: 800 }}
            className="knowledge-table"
        />
    )
}
