import {
    FileTextOutlined,
    DatabaseOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    ArrowUpOutlined,
} from '@ant-design/icons'

import type { KnowledgeStatistics } from '../../types/knowledge'

interface Props {
    statistics?: KnowledgeStatistics
}

const stats = [
    {
        key: 'totalDocuments',
        label: 'TÀI LIỆU',
        icon: FileTextOutlined,
        gradient: 'from-emerald-500 to-teal-500',
        lightBg: 'bg-emerald-50',
        lightText: 'text-emerald-600',
    },
    {
        key: 'totalChunks',
        label: 'CHUNKS',
        icon: DatabaseOutlined,
        gradient: 'from-blue-500 to-indigo-500',
        lightBg: 'bg-blue-50',
        lightText: 'text-blue-600',
    },
    {
        key: 'embeddedDocuments',
        label: 'EMBEDDED',
        icon: CheckCircleOutlined,
        gradient: 'from-violet-500 to-purple-500',
        lightBg: 'bg-violet-50',
        lightText: 'text-violet-600',
    },
    {
        key: 'failedDocuments',
        label: 'FAILED',
        icon: CloseCircleOutlined,
        gradient: 'from-rose-500 to-pink-500',
        lightBg: 'bg-rose-50',
        lightText: 'text-rose-600',
    },
]

export default function StatisticCards({ statistics }: Props) {
    const values: Record<string, number> = {
        totalDocuments: statistics?.totalDocuments ?? 0,
        totalChunks: statistics?.totalChunks ?? 0,
        embeddedDocuments: statistics?.embeddedDocuments ?? 0,
        failedDocuments: statistics?.failedDocuments ?? 0,
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => {
                const Icon = stat.icon
                const value = values[stat.key]

                return (
                    <div
                        key={stat.key}
                        className="group relative bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-default overflow-hidden"
                    >
                        {/* Background gradient on hover */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                        <div className="relative flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-500 m-0 mb-2">{stat.label}</p>
                                <p className="text-3xl font-bold text-gray-800 m-0 tracking-tight">
                                    {value.toLocaleString('vi-VN')}
                                </p>
                                {stat.key !== 'failedDocuments' && value > 0 && (
                                    <div className="flex items-center gap-1 mt-2">
                                        <ArrowUpOutlined className="text-emerald-500 text-xs" />
                                        <span className="text-xs text-emerald-600 font-medium">Đang hoạt động</span>
                                    </div>
                                )}
                                {stat.key === 'failedDocuments' && value === 0 && (
                                    <div className="flex items-center gap-1 mt-2">
                                        <CheckCircleOutlined className="text-emerald-500 text-xs" />
                                        <span className="text-xs text-emerald-600 font-medium">Tốt</span>
                                    </div>
                                )}
                            </div>
                            <div className={`w-12 h-12 rounded-xl ${stat.lightBg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                                <Icon className={`${stat.lightText} text-xl`} />
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
