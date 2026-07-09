/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react'
import { usePayOS } from '@payos/payos-checkout'
import type { PayOSConfig } from '@payos/payos-checkout'
import type { CartItemResponse } from '../model/cart.model'

interface OrderSummary {
  items: CartItemResponse[]
  total: number
  discount: number
  paymentMethod: string
  receiver: string
  phone: string
  address: string
}

interface PayOSEmbeddedProps {
  checkoutUrl: string
  orderId: number
  expiredAt: string | null
  setOnClose: (value: boolean) => void
  orderSummary: OrderSummary
}

export default function PayOSEmbedded({
  checkoutUrl,
  orderId,
  expiredAt,
  setOnClose,
  orderSummary,
}: PayOSEmbeddedProps) {

  console.log("PayOSEmbedded render");
  console.log(orderSummary);
  const [remainingSeconds, setRemainingSeconds] = useState(15 * 60);
  const [copied, setCopied] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"PENDING" | "PAID" | "EXPIRED">("PENDING");
  const { showNotification } = useNotification()
  const navigate = useNavigate()


  // const [remainingSeconds, setRemainingSeconds] = useState(0);



  useEffect(() => {
    if (paymentStatus !== "PENDING") return;
    const timer = setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) return;
        const order = await response.json();
        if (order.paymentStatusName === "PAID") {
          setPaymentStatus("PAID");
          clearInterval(timer);

          showNotification({
            message: "Thanh toán thành công!",
            type: "SUCCESS",
            duration: 3000,
          });

          setTimeout(() => {
            setOnClose(true);
            navigate("/");
          }, 1500);
        }
      } catch (err) {
        console.error(err);
      }
    }, 2000);
    return () => clearInterval(timer);
  }, [orderId, paymentStatus]);

  useEffect(() => {
    if (!expiredAt) return;
    const target = new Date(expiredAt + "Z").getTime();

    console.log("expiredAt =", expiredAt);
    console.log("target =", target);
    console.log("Date.now() =", Date.now());
    console.log("diff =", target - Date.now());

    const update = () => {
      const diff = Math.max(0, Math.floor((target - Date.now()) / 1000));

      setRemainingSeconds(diff);
      if (diff <= 0) {
        setPaymentStatus("EXPIRED");
      }
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [expiredAt]);

  const minutes = String(Math.floor(remainingSeconds / 60)).padStart(2, "0");
  const seconds = String(remainingSeconds % 60).padStart(2, "0");

  const copyCheckoutLink = async () => {
    try {
      await navigator.clipboard.writeText(checkoutUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const openPayOS = () => {
    window.open(checkoutUrl, "_blank");
  };
  return (
    <div className="fixed inset-0 z-52 flex items-center justify-center bg-black/30">
      <div className="flex h-[95vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">

        {/* Header */}
        <div className="border-b bg-gradient-to-r from-emerald-700 to-green-600 px-6 py-5 text-white lg:px-8">
          <h2 className="text-2xl font-bold lg:text-3xl">Thanh toán đơn hàng</h2>
          <p className="mt-1 text-sm text-emerald-100">
            Quét QR bằng ứng dụng ngân hàng hoặc mở PayOS để hoàn tất thanh toán.
          </p>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid gap-6 p-4 lg:p-6 xl:grid-cols-[1.7fr_1fr]">

            {/* LEFT */}
            <div className="flex flex-col gap-6">

              <section className="flex min-h-[520px] items-center justify-center rounded-3xl border border-slate-200 bg-gray-50 p-4 lg:min-h-[620px]">
                <div className="rounded-3xl bg-white p-4 shadow-xl lg:p-8">
                  <QRCode value={qrCode} size={window.innerWidth < 768 ? 260 : window.innerWidth < 1280 ? 340 : 430} />
                </div>
              </section>

              <section className="rounded-3xl border border-slate-200 bg-white p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-500">Liên kết thanh toán</p>

                    <p className="mt-1 break-all text-sm font-medium text-emerald-700">
                      {checkoutUrl}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-emerald-50 px-5 py-3 text-center">
                    <p className="text-xs uppercase tracking-wider text-gray-500">
                      Mã đơn
                    </p>

                    <p className="text-2xl font-bold text-emerald-700">
                      #{orderId}
                    </p>
                  </div>

                </div>
              </section>

            </div>

            {/* RIGHT */}
            <div className="flex flex-col gap-5">

              <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(15,23,42,0.12)]">

                <p className="text-sm uppercase tracking-wide text-gray-500">Thời gian còn lại</p>

                <div className="mt-3 text-6xl font-black tracking-wider text-red-600">
                  {minutes}:{seconds}
                </div>

              </div>

              <div className={`rounded-3xl border border-slate-100 p-5 transition-all ${paymentStatus === "PAID" ? "border-green-300 bg-green-50" : paymentStatus === "EXPIRED" ? "border-red-300 bg-red-50" : "border-amber-300 bg-amber-50"}`}>

                <div className="flex items-center gap-3">

                  {paymentStatus === "PAID" ? <CheckCircle2 className="text-green-600" size={28} /> : <Clock3 className={paymentStatus === "EXPIRED" ? "text-red-600" : "text-amber-600"} size={28} />}

                  <div>

                    <p className="text-lg font-bold">
                      {paymentStatus === "PAID" ? "Đã thanh toán" : paymentStatus === "EXPIRED" ? "QR đã hết hạn" : "Đang chờ thanh toán..."}
                    </p>

                    <p className="text-sm text-gray-500">
                      {paymentStatus === "PAID" ? "Hệ thống đã xác nhận giao dịch." : paymentStatus === "EXPIRED" ? "Liên kết thanh toán đã hết hạn." : "Trạng thái sẽ tự động cập nhật."}
                    </p>

                  </div>

                </div>

              </div>

              <div className="rounded-3xl border border-slate-100 bg-white p-6">

                <h3 className="mb-4 text-xl font-bold">Thông tin đơn hàng</h3>

                <div className="space-y-3 text-sm">

                  <div className="flex justify-between">
                    <span className="text-gray-500">Người nhận</span>
                    <span className="font-semibold">{orderSummary.receiver}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">Số điện thoại</span>
                    <span className="font-semibold">{orderSummary.phone}</span>
                  </div>

                  <div>
                    <p className="text-gray-500 mb-1">Địa chỉ</p>
                    <p className="font-medium">{orderSummary.address}</p>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">Thanh toán</span>
                    <span className="font-semibold">{orderSummary.paymentMethod}</span>
                  </div>

                </div>

              </div>

              <div className="rounded-3xl border border border-slate-100 bg-white p-6">

                <h3 className="mb-4 text-xl font-bold">Sản phẩm</h3>

                <div className="max-h-64 space-y-3 overflow-y-auto">

                  {orderSummary.items.map(item => (
                    <div key={item.productId} className="flex items-start justify-between rounded-2xl bg-gray-50 p-3">
                      <div>
                        <p className="font-semibold">{item.productName}</p>
                        <p className="text-sm text-gray-500">x{item.quantity}</p>
                      </div>
                      <span className="font-semibold">
                        {Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.subtotal)}
                      </span>
                    </div>
                  ))}

                </div>

                <div className="mt-5 space-y-2 border-t pt-4">

                  <div className="flex justify-between">
                    <span>Giảm giá</span>
                    <span className="font-semibold text-red-500">
                      -{Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(orderSummary.discount)}
                    </span>
                  </div>

                  <div className="flex justify-between text-xl font-bold">
                    <span>Tổng tiền</span>
                    <span className="text-emerald-700">
                      {Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(orderSummary.total)}
                    </span>
                  </div>

                </div>

              </div>
              <div className="space-y-3">

                <button
                  onClick={copyCheckoutLink}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-700"
                >
                  <Copy size={18} />
                  {copied ? "Đã sao chép liên kết" : "Sao chép link thanh toán"}
                </button>

                <button
                  onClick={openPayOS}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-600 py-3 font-semibold text-emerald-700 transition hover:bg-emerald-50"
                >
                  <ExternalLink size={18} />
                  Mở trang PayOS
                </button>

                <button
                  onClick={() => setOnClose(true)}
                  className="w-full rounded-2xl border border-gray-300 py-3 font-semibold transition hover:bg-gray-100"
                >
                  Đóng
                </button>

              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );

}
