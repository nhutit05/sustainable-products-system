import { Trash2 } from 'lucide-react'
import { materialFactors } from './data'
import type { MaterialInput } from './types'

interface MaterialRowProps {
  material: MaterialInput
  onChange: (id: string, field: 'material' | 'percentage', value: string | number) => void
  onRemove: (id: string) => void
  disableRemove?: boolean
}

export default function MaterialRow({
  material,
  onChange,
  onRemove,
  disableRemove = false,
}: MaterialRowProps) {
  return (
    <div className="group rounded-2xl border border-green-100 bg-green-50/40 p-4 transition-all hover:border-green-300 hover:shadow-md">
      <div className="grid gap-3 md:grid-cols-[2fr_1fr_auto]">
        {/* Material Select */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Nguyên liệu</label>

          <select
            value={material.material}
            onChange={(e) => onChange(material.id, 'material', e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition-all focus:border-green-500 focus:ring-2 focus:ring-green-200"
          >
            <option value="">-- Chọn nguyên liệu --</option>

            {materialFactors.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        {/* Percentage */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Tỷ lệ (%)</label>

          <input
            type="number"
            min={0}
            max={100}
            value={material.percentage}
            onChange={(e) => onChange(material.id, 'percentage', Number(e.target.value))}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition-all focus:border-green-500 focus:ring-2 focus:ring-green-200"
          />
        </div>

        {/* Remove */}
        <div className="flex items-end">
          <button
            type="button"
            disabled={disableRemove}
            onClick={() => onRemove(material.id)}
            className="flex h-[50px] w-[50px] items-center justify-center rounded-xl bg-red-50 text-red-500 transition-all hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
