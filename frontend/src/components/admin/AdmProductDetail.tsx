import { Descriptions, Modal, Tag, Image, Spin } from 'antd'
import type { ProductResponse } from '../../model/product.model'
import { useEffect, useState } from 'react'
import { useCustomer } from '../../context/useCustomer'
import { Leaf } from 'lucide-react'
import {
  TagOutlined,
  ShopOutlined,
  GlobalOutlined,
  CalendarOutlined,
  BulbOutlined,
} from '@ant-design/icons'

interface ProductDetailProps {
  product: ProductResponse | null
  open: boolean
  onClose: () => void
}

export default function AdmProductDetail({ product, open, onClose }: ProductDetailProps) {
  const [loading, setLoading] = useState(false)
  const { token } = useCustomer()

  useEffect(() => {
    if (!open || !token) return
    let cancelled = false
    ;(async () => {
      setLoading(true)
      try {
        await fetch('http://localhost:8080/api/admin/materials', {
          headers: { Authorization: `Bearer ${token}` },
        })
      } catch (e) {
        console.error('Error fetching materials:', e)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [open, token])

  const formatCurrency = (v: number) =>
    Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v)

  return (
    <Modal
      title={
        <span className="flex items-center gap-2 text-lg font-semibold">
          <ShopOutlined className="text-emerald-500" />
          Chi tiết sản phẩm
        </span>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={720}
      centered
      destroyOnHidden
    >
      <Spin spinning={loading}>
        {!product ? null : (
          <>
            {/* Images */}
            {product.imageUrls && product.imageUrls.length > 0 && (
              <div className="mb-5">
                <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                  Hình ảnh sản phẩm
                </p>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.imageUrls.map((url, i) => (
                    <Image
                      key={i}
                      src={url}
                      alt={`Ảnh ${i + 1}`}
                      width={140}
                      height={100}
                      className="rounded-xl object-cover flex-shrink-0 ring-1 ring-gray-100"
                      preview={{ mask: 'Xem' }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Info */}
            <Descriptions
              bordered
              column={{ xs: 1, sm: 2 }}
              size="small"
              className="product-detail-descriptions"
            >
              <Descriptions.Item label="Tên sản phẩm" span={2}>
                <span className="font-medium">{product.productName}</span>
              </Descriptions.Item>

              <Descriptions.Item label="Giá bán">
                <span className="font-semibold text-emerald-600">
                  {formatCurrency(product.productPrice)}
                </span>
              </Descriptions.Item>

              <Descriptions.Item label="Trạng thái">
                {product.statusSale ? (
                  <Tag color="success">Đang bán</Tag>
                ) : (
                  <Tag color="default">Ngừng bán</Tag>
                )}
              </Descriptions.Item>

              <Descriptions.Item label="Loại sản phẩm">
                <span className="flex items-center gap-1.5">
                  <TagOutlined className="text-gray-400" />
                  {product.categoryName}
                </span>
              </Descriptions.Item>

              <Descriptions.Item label="Tồn kho">
                <span className={product.inventory <= 10 ? 'font-semibold text-red-500' : ''}>
                  {product.inventory}
                </span>
              </Descriptions.Item>

              <Descriptions.Item label="Chỉ số Carbon">
                <span className="flex items-center gap-1">
                  <BulbOutlined className="text-emerald-500" />
                  {product.productCarbonIndex} kg CO₂e
                </span>
              </Descriptions.Item>

              <Descriptions.Item label="Điểm Eco">
                <span className="flex items-center gap-1">
                  {product.baseEcoPoints}
                  <Leaf className="text-emerald-400" size={14} />
                </span>
              </Descriptions.Item>

              <Descriptions.Item label="Khối lượng">
                <span>{product.weight} kg</span>
              </Descriptions.Item>

              <Descriptions.Item label="Nguồn gốc">
                <span className="flex items-center gap-1">
                  <GlobalOutlined className="text-gray-400" />
                  {product.original || 'Không có'}
                </span>
              </Descriptions.Item>

              <Descriptions.Item label="Hạn sử dụng" span={2}>
                <span className="flex items-center gap-1">
                  <CalendarOutlined className="text-gray-400" />
                  {product.expiredAt || 'Không có'}
                </span>
              </Descriptions.Item>

              <Descriptions.Item label="Cập nhật lần cuối" span={2}>
                <span className="flex items-center gap-1">
                  <CalendarOutlined className="text-gray-400" />
                  {product.updatedAt ? new Date(product.updatedAt).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Chưa có thông tin'}
                </span>
              </Descriptions.Item>

              {/* Materials */}
              <Descriptions.Item label="Nguyên liệu" span={2}>
                {product.materials.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {product.materials.map((m) => (
                      <Tag key={m.materialId} color="blue">
                        {m.materialName} — {m.percentage}%
                      </Tag>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-400">Không có nguyên liệu</span>
                )}
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Spin>
    </Modal>
  )
}
