import type { CarbonResult as CarbonResultType } from './types'

interface Props {
  result: CarbonResultType | null
  productName: string
  weight: number
}

export default function CarbonResult({ result, productName, weight }: Props) {
  if (!result) {
    return (
      <div className="rounded-3xl bg-linear-to-br from-emerald-500 to-green-700 p-8 text-white shadow-xl">
        <div className="flex h-full min-h-125 flex-col items-center justify-center text-center">
          <div className="text-6xl">🌱</div>

          <h2 className="mt-4 text-3xl font-bold">Kết quả Carbon</h2>

          <p className="mt-3 text-green-100">
            Hãy nhập thông tin sản phẩm và nhấn
            <br />
            "Tính lượng phát thải Carbon"
          </p>
        </div>
      </div>
    )
  }

  const progress = Math.min(result.score, 100)

  return (
    <div className="rounded-3xl bg-linear-to-br from-emerald-500 via-green-600 to-green-700 p-8 text-white shadow-xl">
      {/* Header */}
      <div className="text-center">
        <div className="text-6xl">🌿</div>

        <h2 className="mt-4 text-3xl font-bold">Kết quả Carbon</h2>

        <p className="mt-2 text-green-100">Lượng phát thải ước tính</p>
      </div>

      {/* Carbon */}
      <div className="my-8 flex justify-center">
        <div className="flex h-44 w-44 flex-col items-center justify-center rounded-full border-[10px] border-white/20 bg-white/10 backdrop-blur">
          <div className="text-4xl font-bold">{result.carbon}</div>

          <div className="text-sm tracking-wide">kg CO₂e</div>
        </div>
      </div>

      {/* Score */}
      <div className="mb-6">
        <div className="mb-2 flex justify-between text-sm">
          <span>Điểm Carbon</span>
          <span>{result.score}/100</span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-white transition-all duration-700"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>

      {/* Level */}
      <div className="space-y-4">
        <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
          <p className="text-sm text-green-100">Mức phát thải</p>

          <p className="mt-1 text-xl font-bold">{result.level}</p>
        </div>

        <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
          <p className="text-sm text-green-100">Tương đương</p>

          <div className="mt-3 space-y-2">
            <div>
              🚗 Khoảng <strong>{(result.carbon * 4).toFixed(0)} km</strong> di chuyển bằng ô tô
            </div>

            <div>
              💡 Khoảng <strong>{(result.carbon * 1.5).toFixed(0)} ngày</strong> sử dụng điện
            </div>

            <div>
              🌳 Cần khoảng <strong>{Math.max(1, Math.ceil(result.carbon / 20))}</strong> cây xanh
              để hấp thụ
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
          <p className="text-sm text-green-100">Khuyến nghị</p>

          <p className="mt-2 leading-7">{result.recommendation}</p>
        </div>
      </div>
    </div>
  )
}
