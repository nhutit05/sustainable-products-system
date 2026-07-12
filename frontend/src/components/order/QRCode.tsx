import { XIcon } from 'lucide-react'

interface QRCodeProps {
  qrCode: string
  qrCodeName: string
  setIsQRCode: (value: boolean) => void
}

export default function QRCode({ qrCode, qrCodeName, setIsQRCode }: QRCodeProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center ">
      <div className="w-md max-w-md rounded-2xl bg-gray-100 p-6 shadow-lg relative">
        <XIcon
          className="absolute top-4 right-4 h-6 w-6 cursor-pointer text-gray-600 hover:text-gray-800"
          onClick={() => setIsQRCode(false)}
        />
        <h3 className="mb-4 text-lg font-semibold text-green-900">Quét mã QR để thanh toán</h3>

        <div className="mx-4">
          <div className="aspect-square w-full mx-auto rounded-xl bg-white p-4 shadow">
            <img src={qrCode} className="w-full h-full object-contain" />
          </div>
        </div>
        {/* THONG TIN NGAN HANG */}
        <div className="mt-4">
          <h2 className="text-black text-md font-light uppercase">
            <span className="font-semibold text-green-900 normal-case">Ngân hàng: </span>
            {qrCodeName}
          </h2>
          <p className="text-green-900 text-md font-semibold">
            Nội dung chuyển khoản:
            <br />
            <span className="font-light text-black">THANH_TOAN_TRUC_TUYEN</span>
          </p>
        </div>
      </div>
    </div>
  )
}
