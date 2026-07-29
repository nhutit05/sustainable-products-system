import { useEffect, useState } from 'react'
import { Modal, Spin, Empty } from 'antd'
import { Check, Leaf, Sprout } from 'lucide-react'
import type { CompareProductResponse } from '../model/compare.model'

interface CompareProductResultProps {
  open: boolean
  productIds: number[]
  onClose: () => void
}

export default function CompareProductResult({
  open,
  productIds,
  onClose,
}: CompareProductResultProps) {
  const [data, setData] = useState<CompareProductResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!open || productIds.length === 0) return

    const fetchCompareData = async () => {
      setLoading(true)
      setError(false)
      try {
        const query = productIds.map((id) => `productIds=${id}`).join('&')
        const response = await fetch(`http://localhost:8080/api/products/compare?${query}`)
        if (response.ok) {
          const result = await response.json()
          setData(result)
        } else {
          setError(true)
        }
      } catch (err) {
        console.error('Error fetching compare data:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchCompareData()
  }, [open, productIds])

  const columnTemplate = data
    ? `minmax(140px,180px) repeat(${data.products.length}, minmax(160px, 1fr))`
    : undefined

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
          <div className="w-2.5 h-6 bg-emerald-500 rounded-full" />
          <span className="text-lg font-bold text-gray-800 uppercase tracking-wide">
            Kết quả so sánh sản phẩm
          </span>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width="min(1100px, 95vw)"
      className="custom-compare-modal"
      styles={{
        body: {
          maxHeight: 'calc(100vh - 200px)',
          overflowY: 'auto',
          overflowX: 'hidden',
        },
      }}
    >
      {loading && (
        <div className="flex justify-center items-center py-16">
          <Spin size="large" />
        </div>
      )}

      {!loading && error && (
        <Empty description="Không thể tải dữ liệu so sánh, vui lòng thử lại." className="py-10" />
      )}

      {!loading && !error && data && (
        <div className="overflow-x-auto -mx-2 px-2 pb-2">
          <div className="min-w-max">
            {/* Hàng thông tin từng sản phẩm */}
            <div className="grid gap-2 mb-3" style={{ gridTemplateColumns: columnTemplate }}>
              <div className="sticky left-0 bg-white" />
              {data.products.map((product) => (
                <div
                  key={product.productId}
                  className="rounded-2xl border border-emerald-100 bg-white p-3 flex flex-col items-center text-center gap-1.5"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-emerald-100">
                    <img
                      src={product.imageUrl ?? ''}
                      alt={product.productName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-sm font-semibold text-green-900 leading-tight line-clamp-2">
                    {product.productName}
                  </p>
                  <p className="text-sm font-bold text-red-500">
                    {product.productPrice?.toLocaleString()} VNĐ
                  </p>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <Leaf className="w-3 h-3" />
                    {product.productCarbonIndex} kgCO₂e
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    <Sprout className="w-3 h-3" />
                    {product.baseEcoPoints} Eco Points
                  </div>
                </div>
              ))}
            </div>

            {/* Từng nhóm thuộc tính */}
            {data.sections.map((section) => (
              <div key={section.sectionName} className="mb-4">
                <div className="bg-emerald-50 text-emerald-800 text-sm font-bold rounded-xl px-3 py-1.5 mb-2 sticky left-0 w-fit">
                  {section.sectionName}
                </div>

                {section.attributes.map((attribute) => (
                  <div
                    key={attribute.key}
                    className="grid gap-2 items-stretch border-b border-gray-50 last:border-0"
                    style={{ gridTemplateColumns: columnTemplate }}
                  >
                    <div className="sticky left-0 bg-white flex items-center text-sm font-medium text-gray-600 py-2.5 pr-2">
                      {attribute.label}
                    </div>
                    {data.products.map((product) => {
                      const value = attribute.values[String(product.productId)] ?? '—'
                      const isBest =
                        !!attribute.highlightedValue && value === attribute.highlightedValue

                      return (
                        <div
                          key={product.productId}
                          className={`flex items-center justify-center gap-1.5 text-sm rounded-xl py-2.5 my-1 text-center px-2 ${
                            isBest
                              ? 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200'
                              : 'text-gray-600'
                          }`}
                        >
                          {isBest && <Check className="w-3.5 h-3.5 shrink-0" />}
                          <span className="truncate">{value}</span>
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </Modal>
  )
}
