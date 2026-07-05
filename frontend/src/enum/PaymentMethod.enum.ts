// 1. Định nghĩa Object ánh xạ từ Số sang Chuỗi định danh tiếng Anh
export const PaymentMethodId = {
  1: 'BANK_TRANSFER',
  2: 'CASH',
  3: 'MOMO',
} as const

// 2. Định nghĩa Kiểu dữ liệu số hợp lệ (chỉ chấp nhận 1 | 2 | 3)
export type PaymentMethodNumber = keyof typeof PaymentMethodId // Kỹ thuật tự động lấy các key số

// 3. (Mở rộng thêm nếu bạn muốn) Ánh xạ từ Số sang Tên tiếng Việt hiển thị trên giao diện
export const PaymentMethodName: Record<PaymentMethodNumber, string> = {
  1: 'Thanh toán bằng tài khoản ngân hàng',
  2: 'Thanh toán bằng tiền mặt',
  3: 'Thanh toán bằng ví điện tử',
}
