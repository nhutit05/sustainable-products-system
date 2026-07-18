import { useMemo, useState } from 'react'
import { Leaf, Package, Scale, Plus } from 'lucide-react'

import MaterialRow from './MaterialRow'
import CarbonResult from './CarbonResult'

import type { CarbonResult as CarbonResultType, MaterialInput } from './types'
import { calculateCarbon } from './caculator'

export default function CarbonCalculator() {
  const [productName, setProductName] = useState('')

  const [weight, setWeight] = useState<number>(1)

  const [materials, setMaterials] = useState<MaterialInput[]>([
    {
      id: crypto.randomUUID(),
      material: '',
      percentage: 100,
    },
  ])

  const [result, setResult] = useState<CarbonResultType | null>(null)

  const totalPercentage = useMemo(() => {
    return materials.reduce((sum, item) => sum + Number(item.percentage), 0)
  }, [materials])

  const handleAddMaterial = () => {
    setMaterials((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        material: '',
        percentage: 0,
      },
    ])
  }

  const handleRemoveMaterial = (id: string) => {
    if (materials.length === 1) return

    setMaterials((prev) => prev.filter((m) => m.id !== id))
  }

  const handleMaterialChange = (
    id: string,
    field: 'material' | 'percentage',
    value: string | number
  ) => {
    setMaterials((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: field === 'percentage' ? Number(value) : value,
            }
          : item
      )
    )
  }

  const handleCalculate = () => {
    if (!productName.trim()) {
      alert('Vui lòng nhập tên sản phẩm')
      return
    }

    if (weight <= 0) {
      alert('Khối lượng phải lớn hơn 0')
      return
    }

    if (totalPercentage !== 100) {
      alert('Tổng tỷ lệ nguyên liệu phải bằng 100%')
      return
    }

    const hasEmptyMaterial = materials.some((item) => item.material === '')

    if (hasEmptyMaterial) {
      alert('Vui lòng chọn đầy đủ nguyên liệu')
      return
    }

    const carbon = calculateCarbon(weight, materials)

    setResult(carbon)
  }

  return (
    <div className="min-h-screen bg-[#F7FCF5] py-10 mt-8">
      <div className="mx-auto max-w-7xl px-4">
        {/* HERO */}
        <div className="overflow-hidden rounded-3xl bg-linear-to-r from-emerald-500 via-green-500 to-lime-500 p-10 text-white shadow-xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-white/20">
              <Leaf size={40} />
            </div>
            <h1 className="text-4xl font-bold">Công cụ tính lượng phát thải Carbon</h1>
            <p className="mt-5 text-lg text-green-50 leading-8">
              Nhập thông tin sản phẩm và thành phần nguyên liệu để ước tính lượng phát thải CO₂
              trong quá trình sản xuất.
            </p>
          </div>
        </div>

        {/* CONTENT */}
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* LEFT */}

          <div className="lg:col-span-2 rounded-3xl bg-white p-8 shadow-lg">
            <h2 className="mb-8 text-3xl font-bold">Thông tin sản phẩm</h2>
            {/* Product Name */}
            <div className="mb-6">
              <label className="mb-2 flex items-center gap-2 font-semibold">
                <Package size={18} />
                Tên sản phẩm
              </label>
              <input
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Ví dụ: Túi vải Canvas"
                className="w-full rounded-xl border border-gray-200 p-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-200"
              />
            </div>
            {/* Weight */}
            <div className="mb-8">
              <label className="mb-2 flex items-center gap-2 font-semibold">
                <Scale size={18} />
                Khối lượng sản phẩm (kg)
              </label>
              <input
                type="number"
                min={0}
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full rounded-xl border border-gray-200 p-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-200"
              />
            </div>

            <hr className="my-8" />

            {/* MATERIAL */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">Thành phần nguyên liệu</h3>
                <p className="mt-1 text-sm text-gray-500">Tổng tỷ lệ phải bằng 100%</p>
              </div>

              <button
                onClick={handleAddMaterial}
                className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-white transition hover:bg-green-700"
              >
                <Plus size={18} />
                Thêm
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {materials.map((material) => (
                <MaterialRow
                  key={material.id}
                  material={material}
                  onChange={handleMaterialChange}
                  onRemove={handleRemoveMaterial}
                />
              ))}
            </div>

            {/* Progress tổng tỷ lệ */}
            <div className="mt-8">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-medium text-gray-700">Tổng tỷ lệ nguyên liệu</span>

                <span
                  className={`font-bold ${
                    totalPercentage === 100 ? 'text-green-600' : 'text-red-500'
                  }`}
                >
                  {totalPercentage}%
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    totalPercentage === 100 ? 'bg-green-500' : 'bg-red-400'
                  }`}
                  style={{
                    width: `${Math.min(totalPercentage, 100)}%`,
                  }}
                />
              </div>

              {totalPercentage !== 100 && (
                <p className="mt-2 text-sm text-red-500">
                  Tổng phần trăm nguyên liệu phải bằng 100%.
                </p>
              )}
            </div>

            {/* Preview */}
            <div className="mt-8 rounded-2xl border border-green-100 bg-green-50 p-5">
              <h4 className="mb-3 text-lg font-semibold text-green-700">Thông tin sản phẩm</h4>

              <div className="space-y-2 text-gray-700">
                <div className="flex justify-between">
                  <span>Tên sản phẩm</span>
                  <span className="font-semibold">{productName || 'Chưa nhập'}</span>
                </div>

                <div className="flex justify-between">
                  <span>Khối lượng</span>
                  <span className="font-semibold">{weight} kg</span>
                </div>

                <div className="flex justify-between">
                  <span>Số nguyên liệu</span>
                  <span className="font-semibold">{materials.length}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCalculate}
              className="mt-8 w-full rounded-2xl bg-linear-to-r from-green-600 to-emerald-500 py-4 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-95"
            >
              🌱 Tính lượng phát thải Carbon
            </button>
          </div>
          {/* RIGHT */}
          <div>
            <CarbonResult result={result} productName={productName} weight={weight} />
          </div>
        </div>
      </div>
    </div>
  )
}
