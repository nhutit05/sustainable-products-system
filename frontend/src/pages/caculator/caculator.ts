import { materialFactors } from './data'
import type { CarbonResult, MaterialInput } from './types'

export function calculateCarbon(weight: number, materials: MaterialInput[]): CarbonResult {
  let totalCarbon = 0

  materials.forEach((item) => {
    const factor = materialFactors.find((m) => m.name === item.material)?.factor ?? 0

    totalCarbon += weight * factor * (item.percentage / 100)
  })

  totalCarbon = Number(totalCarbon.toFixed(2))

  let level = ''
  let color = ''
  let recommendation = ''

  if (totalCarbon <= 5) {
    level = 'Rất thấp'
    color = 'bg-green-500'
    recommendation = 'Sản phẩm rất thân thiện với môi trường. Hãy tiếp tục duy trì.'
  } else if (totalCarbon <= 15) {
    level = 'Thấp'
    color = 'bg-lime-500'
    recommendation = 'Có thể thay thế thêm nguyên liệu tái chế để giảm phát thải.'
  } else if (totalCarbon <= 30) {
    level = 'Trung bình'
    color = 'bg-yellow-500'
    recommendation = 'Nên giảm tỷ lệ nhựa hoặc kim loại để giảm lượng CO₂.'
  } else {
    level = 'Cao'
    color = 'bg-red-500'
    recommendation = 'Khuyến nghị thiết kế lại sản phẩm hoặc sử dụng nguyên liệu xanh.'
  }

  const score = Math.max(0, Math.round(100 - totalCarbon * 2))

  return {
    carbon: totalCarbon,
    score,
    level,
    color,
    recommendation,
  }
}
