import { Modal, Form, Input, Select, Divider } from 'antd'
import { Banknote, Receipt } from 'lucide-react'
import type { OrderResponse } from '../../model/checkout.model'
import { useEffect, useState } from 'react'
import type { RefundSlipRequest } from '../../model/order.model'
import { useNotification } from '../../context/useNotification'
import type { BankResponse } from '../../model/bank.model'

const { TextArea } = Input

interface InvoiceOrderProps {
  order: OrderResponse
  setOnClose: (value: boolean) => void
}

// Danh sách ngân hàng phổ biến tại VN (mã BIN theo Napas).
// TODO: nếu backend đã có API danh sách ngân hàng, thay list tĩnh này bằng dữ liệu fetch được.

export default function RefundSlip({ order, setOnClose }: InvoiceOrderProps) {
  const [form] = Form.useForm<RefundSlipRequest>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { showNotification } = useNotification()
  const [BANK_OPTIONS, setBankOptions] = useState<BankResponse[]>([])

  const token = localStorage.getItem('token')

  const closeModal = () => {
    if (isSubmitting) return
    setOnClose(false)
  }

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/banks', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data: BankResponse[] = await response.json()
          setBankOptions(data)
        }
      } catch (error) {
        console.error('Error fetching banks:', error)
      }
    }

    fetchBanks()
  }, [token])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()

      const refundData: RefundSlipRequest = {
        ...values,
        orderId: order.orderId,
      }

      setIsSubmitting(true)

      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8080/api/refund-slips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(refundData),
      })

      if (!response.ok) throw new Error('Refund request failed')

      showNotification({
        message: 'Gửi yêu cầu hoàn tiền thành công',
        type: 'SUCCESS',
        duration: 3000,
      })
      setOnClose(false)
    } catch (error) {
      // Lỗi validate của antd Form cũng rơi vào đây nhưng không cần xử lý gì thêm,
      // antd đã tự hiển thị lỗi ngay trên từng ô input.
      if (error instanceof Error) {
        console.error('Error submitting refund slip:', error)
        setOnClose(false)
        showNotification({
          message: 'Gửi yêu cầu hoàn tiền thất bại. Vui lòng thử lại.',
          type: 'ERROR',
          duration: 3000,
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-green-900">
          <Banknote size={20} className="text-emerald-600" />
          <span>Phiếu hoàn tiền</span>
        </div>
      }
      onCancel={closeModal}
      onOk={handleSubmit}
      cancelText="Đóng"
      okText="Xác nhận"
      confirmLoading={isSubmitting}
      cancelButtonProps={{ disabled: isSubmitting }}
      open={true}
      destroyOnHidden
    >
      <div className="invoice-order">
        <div className="flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-100 px-3.5 py-2.5 mb-4">
          <div className="flex items-center gap-2 text-green-800 text-sm">
            <Receipt size={16} className="text-emerald-600" />
            <span className="font-medium">Mã đơn hàng</span>
          </div>
          <span className="font-semibold text-green-900">#{order.orderId}</span>
        </div>

        <Divider className="my-3!" />

        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          // Chỉ validate khi rời khỏi ô (blur) hoặc khi bấm Xác nhận,
          // không báo lỗi ngay trong lúc đang gõ dở.
          validateTrigger="onBlur"
          initialValues={{
            bankId: '',
            bankNumber: '',
            accountBankName: '',
            reason: '',
          }}
        >
          <Form.Item
            label="Ngân hàng thụ hưởng"
            name="bankId"
            rules={[{ required: true, message: 'Vui lòng chọn ngân hàng' }]}
          >
            <Select
              placeholder="Chọn ngân hàng"
              options={BANK_OPTIONS.map((bank) => ({ value: bank.bankId, label: bank.bankName }))}
              showSearch
              optionFilterProp="label"
            />
          </Form.Item>

          <Form.Item
            label="Số tài khoản"
            name="bankNumber"
            rules={[
              { required: true, message: 'Vui lòng nhập số tài khoản' },
              {
                pattern: /^[0-9]{6,19}$/,
                message: 'Số tài khoản chỉ gồm 6–19 chữ số',
              },
            ]}
          >
            <Input placeholder="Nhập số tài khoản ngân hàng" inputMode="numeric" maxLength={19} />
          </Form.Item>

          <Form.Item
            label="Tên chủ tài khoản"
            name="accountBankName"
            // normalize chạy TRƯỚC khi antd lưu giá trị vào Form và trước khi validate,
            // nên giá trị dùng để so khớp regex luôn là bản đã viết hoa — không còn
            // tình trạng validate nhầm với giá trị gốc (chưa viết hoa) như khi dùng
            // onChange thủ công gây ra.
            normalize={(value: string) => value?.toUpperCase()}
            rules={[
              { required: true, message: 'Vui lòng nhập tên chủ tài khoản' },
              {
                pattern: /^[A-ZÀ-Ỹ\s]+$/,
                message: 'Vui lòng nhập đúng như trên thẻ ngân hàng, viết HOA không dấu',
              },
            ]}
          >
            <Input placeholder="VD: NGUYEN VAN A" />
          </Form.Item>

          <Form.Item
            label="Lý do hoàn tiền"
            name="reason"
            rules={[
              { required: true, message: 'Vui lòng nhập lý do hoàn tiền' },
              { min: 10, message: 'Lý do cần ít nhất 10 ký tự để chúng tôi hỗ trợ tốt hơn' },
              { max: 500, message: 'Lý do không được vượt quá 500 ký tự' },
            ]}
          >
            <TextArea
              placeholder="Mô tả lý do bạn muốn hoàn tiền cho đơn hàng này..."
              rows={4}
              maxLength={500}
              showCount
            />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}
