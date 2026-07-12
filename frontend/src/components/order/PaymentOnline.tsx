import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import QRCode from './QRCode'

export default function PaymentOnline() {
  const location = useLocation()

  const navigate = useNavigate()

  const orderIdParam = location.pathname.split('/').pop()

  const [isQRCode, setIsQRCode] = useState(false)

  const [showQRCode, setShowQRCode] = useState(false)
  const queryParam = new URLSearchParams(location.search)

  useEffect(() => {
    if (orderIdParam) {
      console.log('Order ID:', orderIdParam)
    }
  }, [orderIdParam])

  useEffect(() => {
    const checkQRQuery = () => {
      const qrCodeParam = queryParam.get('qrCode')
      if (qrCodeParam) {
        setIsQRCode(true)
      } else {
        setIsQRCode(false)
      }
    }

    checkQRQuery()
  }, [queryParam])

  const paymentDetails = [
    { label: 'Tên người nhận', value: 'Nguyễn Văn A' },
    { label: 'Mã ngân hàng', value: 'VCB' },
    { label: 'Số tài khoản', value: '123456789' },
    { label: 'Nội dung chuyển khoản', value: 'THANH_TOAN_<MA_DON_HANG>' },
  ]

  const listBankImages = [
    {
      label: 'Vietcombank',
      imageUrl: 'https://res.cloudinary.com/dl9cupba4/image/upload/v1783065429/VCB_xu1ils.png',
    },
    {
      label: 'Agribank',
      imageUrl: 'https://res.cloudinary.com/dl9cupba4/image/upload/v1783064328/AGRB_hkyvma.webp',
    },
    {
      label: 'BIDV',
      imageUrl: 'https://res.cloudinary.com/dl9cupba4/image/upload/v1783065428/BIDV_t2z9wq.png',
    },
    {
      label: 'Vietinbank',
      imageUrl: 'https://res.cloudinary.com/dl9cupba4/image/upload/v1783065428/VTB_lvscjn.png',
    },
    {
      label: 'MBBank',
      imageUrl: 'https://res.cloudinary.com/dl9cupba4/image/upload/v1783065429/MB_is0qga.png',
    },
  ]

  const [qrCode, setQrCode] = useState(
    'https://res.cloudinary.com/dl9cupba4/image/upload/v1783065934/loading_amq8xw.gif'
  )

  const handleBankClick = (bankName: string) => {
    // const qrCodeUrl = `https://res.cloudinary.com/dl9cupba4/image/upload/v1783065934/${bankName}_qr.png`
    // setQrCode(qrCodeUrl)
    navigate(`?qrCode=${bankName}`)
    setShowQRCode(true)
  }

  return (
    <div className="paymentOnline_page text-left max-w-7xl mx-auto">
      <header className="paymentOnline-header mt-20 pb-8 border-b border-emerald-100">
        <h2 className="text-2xl font-bold text-green-800">Payment Online</h2>
      </header>

      <main className="paymentOnline-main grid grid-cols-3 gap-8 mt-8">
        <div className="paymentOnline_info col-span-2 p-4 rounded-2xl shadow bg-emerald-50">
          <h3 className="text-green-900 text-lg font-semibold mb-2">
            Thông tin tài khoản nhận hàng
          </h3>
          <div className="paymentOnline_details pl-3 mb-3">
            {paymentDetails.map((detail, index) => (
              <div key={index} className="mb-2 ">
                <strong className="mr-2">{detail.label}: </strong>
                <span className="uppercase">{detail.value}</span>
              </div>
            ))}
          </div>

          {/* LIST BANK QR */}
          <div className="bankQR_list pt-4 border-t border-gray-200">
            <h2 className="text-green-900 text-lg font-semibold">
              Danh sách ngân hàng hỗ trợ thanh toán QR
            </h2>

            <div className="">
              <div className="flex items-center gap-4 flex-wrap mt-4">
                {listBankImages.map((bank, index) => {
                  return (
                    <button
                      key={index}
                      onClick={() => handleBankClick(bank.label)}
                      className=" w-38 h-12 overflow-hidden rounded-2xl border border-green-800 bg-white shadow-s shadow-emerald-100 hover:shadow-md hover:cursor-pointer hover:scale-102 transition-transform duration-300 flex items-center justify-center"
                    >
                      <img
                        src={bank.imageUrl}
                        alt={bank.label}
                        className="w-full h-full object-contain"
                      />
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* THONG TIN DON HANG */}
        <aside className="showQR p-4 rounded-2xl shadow bg-emerald-50">
          <h3 className="text-green-900 text-lg font-semibold mb-2">Thông tin đơn hàng</h3>
          <div className="qrCodeContainer bg-white p-4 rounded-lg shadow">
            <ul className="px-2">
              <li className="mb-2">
                <strong>Mã đơn hàng: </strong>
                <span className="uppercase">{orderIdParam}</span>
              </li>
              <li className="mb-2">
                <strong>Người nhận hàng: </strong>
                <span className="uppercase">Nguyen Van A</span>
              </li>
              <li className="mb-2">
                <strong>Địa chỉ nhận hàng: </strong>
                <span className="uppercase">123 Đường ABC, Quận XYZ, TP. HCM</span>
              </li>
              <li className="mb-2">
                <strong>Ngày đặt hàng: </strong>
                <span className="uppercase">{new Date().toLocaleDateString()}</span>
              </li>
              <li className="mb-2">
                <strong>Tổng tiền: </strong>
                <span className="uppercase text-red-500 font-semibold ml-3">1,000,000 VND</span>
              </li>
            </ul>
          </div>
        </aside>
      </main>

      {showQRCode ? (
        <QRCode
          qrCode={qrCode}
          qrCodeName={queryParam.get('qrCode') || ''}
          setIsQRCode={setShowQRCode}
        />
      ) : null}
    </div>
  )
}
