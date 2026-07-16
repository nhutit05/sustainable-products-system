import { Drawer, Tag, Empty, Spin } from 'antd'
import {
    FileTextOutlined,
    FilePdfOutlined,
    FileWordOutlined,
    DatabaseOutlined,
    OrderedListOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    SyncOutlined,
    CloseCircleOutlined,
    UploadOutlined,
    EyeOutlined,
} from '@ant-design/icons'

import type { KnowledgeDocumentDetail } from '../../types/knowledge'

interface Props {
    open: boolean
    onClose: () => void
    document?: KnowledgeDocumentDetail
}

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

export default function KnowledgeDetailDrawer({ open, onClose, document }: Props) {
    if (!document) {
        return (
            <Drawer
                title={
                    <div className="flex items-center gap-2">
                        <FileTextOutlined className="text-emerald-600" />
                        <span>Chi tiết tài liệu</span>
                    </div>
                }
                width={Math.min(600, window.innerWidth - 32)}
                open={open}
                onClose={onClose}
                className="knowledge-detail-drawer"
            >
                <div className="flex items-center justify-center py-20">
                    <Empty description="Không có dữ liệu" />
                </div>
            </Drawer>
        )
    }

    const status = statusConfig[document.status] || {
        color: '#6b7280',
        icon: null,
        bg: 'bg-gray-50',
    }

    const infoItems = [
        {
            icon: document.documentType === 'PDF' ? <FilePdfOutlined /> : <FileWordOutlined />,
            label: 'Loại tài liệu',
            value: document.documentType,
            color: document.documentType === 'PDF' ? 'text-red-500' : 'text-blue-500',
            bg: document.documentType === 'PDF' ? 'bg-red-50' : 'bg-blue-50',
        },
        {
            icon: <DatabaseOutlined />,
            label: 'Kích thước',
            value: `${(document.fileSize / 1024).toFixed(1)} KB`,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
        },
        {
            icon: <OrderedListOutlined />,
            label: 'Số chunks',
            value: document.chunkCount.toLocaleString('vi-VN'),
            color: 'text-blue-600',
            bg: 'bg-blue-50',
        },
        {
            icon: <EyeOutlined />,
            label: 'Ký tự',
            value: document.characterCount.toLocaleString('vi-VN'),
            color: 'text-violet-600',
            bg: 'bg-violet-50',
        },
        {
            icon: <FileTextOutlined />,
            label: 'Từ',
            value: document.wordCount.toLocaleString('vi-VN'),
            color: 'text-amber-600',
            bg: 'bg-amber-50',
        },
    ]

    return (
        <Drawer
            title={
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                        <EyeOutlined className="text-emerald-600" />
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-gray-800 m-0">Chi tiết tài liệu</h3>
                        <p className="text-xs text-gray-400 m-0 mt-0.5">{document.fileName}</p>
                    </div>
                </div>
            }
            width={Math.min(600, window.innerWidth - 32)}
            open={open}
            onClose={onClose}
            className="knowledge-detail-drawer"
            styles={{ header: { borderBottom: '1px solid #f0f0f0' } }}
        >
            <div className="space-y-5">
                {/* Document Name Card */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-100">
                    <div className="flex items-start gap-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                            document.documentType === 'PDF'
                                ? 'bg-gradient-to-br from-red-400 to-red-500'
                                : 'bg-gradient-to-br from-blue-400 to-blue-500'
                        }`}>
                            {document.documentType === 'PDF' ? (
                                <FilePdfOutlined className="text-white text-2xl" />
                            ) : (
                                <FileWordOutlined className="text-white text-2xl" />
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <h2 className="text-lg font-bold text-gray-800 m-0 truncate">
                                {document.fileName}
                            </h2>
                            <div className="flex items-center gap-2 mt-2">
                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.bg}`}
                                    style={{ color: status.color, border: `1px solid ${status.color}20` }}
                                >
                                    {status.icon}
                                    <span>{document.status}</span>
                                </div>
                                <span className="text-xs text-gray-400">
                                    Tải lên {new Date(document.uploadedAt + 'Z').toLocaleDateString('vi-VN')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Grid */}
                <div>
                    <h4 className="text-sm font-semibold text-gray-700 m-0 mb-3 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center">
                            <FileTextOutlined className="text-blue-600 text-xs" />
                        </div>
                        Thông tin chi tiết
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {infoItems.map((item, index) => (
                            <div key={index} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className={`w-7 h-7 rounded-lg ${item.bg} flex items-center justify-center`}>
                                        <span className={`${item.color} text-sm`}>{item.icon}</span>
                                    </div>
                                    <span className="text-xs text-gray-500">{item.label}</span>
                                </div>
                                <p className="text-lg font-bold text-gray-800 m-0">
                                    {item.value}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upload Time */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center">
                            <ClockCircleOutlined className="text-gray-500 text-sm" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 m-0">Thời gian tải lên</p>
                            <p className="text-sm font-semibold text-gray-700 m-0 mt-0.5">
                                {new Date(document.uploadedAt + 'Z').toLocaleString('vi-VN')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Preview Section */}
                {document.preview && (
                    <div>
                        <h4 className="text-sm font-semibold text-gray-700 m-0 mb-3 flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md bg-violet-100 flex items-center justify-center">
                                <EyeOutlined className="text-violet-600 text-xs" />
                            </div>
                            Nội dung xem trước
                        </h4>
                        <div className="bg-gray-900 rounded-2xl p-4 sm:p-5 overflow-hidden">
                            <pre className="text-sm text-gray-300 m-0 whitespace-pre-wrap break-words font-mono leading-relaxed"
                                style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
                            >
                                {document.preview}
                            </pre>
                        </div>
                    </div>
                )}
            </div>
        </Drawer>
    )
}
