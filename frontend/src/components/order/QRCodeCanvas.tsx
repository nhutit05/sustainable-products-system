import { useRef, useEffect } from 'react'
import { qrcode } from 'qrcode-generator'

interface QRCodeCanvasProps {
  value: string
  size?: number
}

export default function QRCodeCanvas({ value, size = 200 }: QRCodeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const qr = qrcode(0, 'M')
    qr.addData(value)
    qr.make()

    const moduleCount = qr.getModuleCount()
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = size
    canvas.height = size

    const cellSize = size / moduleCount

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, size, size)

    ctx.fillStyle = '#000000'
    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        if (qr.isDark(row, col)) {
          ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize)
        }
      }
    }
  }, [value, size])

  return <canvas ref={canvasRef} style={{ width: size, height: size }} />
}
