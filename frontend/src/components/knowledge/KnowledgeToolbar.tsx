import { Input, Select, Button, Tooltip } from 'antd'
import {
    ReloadOutlined,
    SearchOutlined,
    FilterOutlined,
    ClearOutlined,
} from '@ant-design/icons'

interface KnowledgeToolbarProps {
    keyword: string
    statusFilter: string
    onKeywordChange: (value: string) => void
    onStatusChange: (value: string) => void
    onRefresh: () => void
}

const statusOptions = [
    { label: 'Tất cả trạng thái', value: 'ALL' },
    { label: 'UPLOADED', value: 'UPLOADED', color: '#8b5cf6' },
    { label: 'PARSED', value: 'PARSED', color: '#f59e0b' },
    { label: 'CHUNKED', value: 'CHUNKED', color: '#3b82f6' },
    { label: 'EMBEDDED', value: 'EMBEDDED', color: '#10b981' },
    { label: 'FAILED', value: 'FAILED', color: '#ef4444' },
]

const KnowledgeToolbar = ({
    keyword,
    statusFilter,
    onKeywordChange,
    onStatusChange,
    onRefresh,
}: KnowledgeToolbarProps) => {
    const hasFilter = keyword || statusFilter !== 'ALL'

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-3 sm:p-4"
            style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
        >
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Search Input */}
                <div className="flex-1 min-w-0">
                    <Input
                        allowClear
                        value={keyword}
                        onChange={(e) => onKeywordChange(e.target.value)}
                        placeholder="Tìm kiếm tài liệu..."
                        prefix={<SearchOutlined className="text-emerald-500" />}
                        size="large"
                        className="!rounded-xl"
                        style={{ maxWidth: '100%' }}
                    />
                </div>

                {/* Filter Controls */}
                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    {/* Status Filter */}
                    <Select
                        value={statusFilter}
                        onChange={onStatusChange}
                        size="large"
                        className="!rounded-xl min-w-[160px]"
                        suffixIcon={<FilterOutlined className="text-gray-400" />}
                        options={statusOptions.map(opt => ({
                            ...opt,
                            label: (
                                <div className="flex items-center gap-2">
                                    {opt.value !== 'ALL' && (
                                        <span
                                            className="w-2 h-2 rounded-full"
                                            style={{ backgroundColor: opt.color }}
                                        />
                                    )}
                                    <span>{opt.label}</span>
                                </div>
                            )
                        }))}
                    />

                    {/* Refresh Button */}
                    <Tooltip title="Làm mới">
                        <Button
                            icon={<ReloadOutlined />}
                            onClick={onRefresh}
                            size="large"
                            className="!rounded-xl !w-11 !h-11 !flex !items-center !justify-center"
                        />
                    </Tooltip>

                    {/* Clear Filter Button */}
                    {hasFilter && (
                        <Tooltip title="Xóa bộ lọc">
                            <Button
                                icon={<ClearOutlined />}
                                onClick={() => {
                                    onKeywordChange('')
                                    onStatusChange('ALL')
                                }}
                                size="large"
                                danger
                                className="!rounded-xl !w-11 !h-11 !flex !items-center !justify-center"
                            />
                        </Tooltip>
                    )}
                </div>
            </div>

            {/* Active Filters Indicator */}
            {hasFilter && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-400">Đang lọc:</span>
                    {keyword && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full">
                            <SearchOutlined className="text-[10px]" />
                            "{keyword}"
                        </span>
                    )}
                    {statusFilter !== 'ALL' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                            <FilterOutlined className="text-[10px]" />
                            {statusFilter}
                        </span>
                    )}
                </div>
            )}
        </div>
    )
}

export default KnowledgeToolbar
