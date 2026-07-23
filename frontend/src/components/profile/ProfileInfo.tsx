import { Check, IdCard, Leaf, MailCheck, Phone, SquarePen, UserCircle, X } from 'lucide-react'
import { useCustomer } from '../../context/useCustomer'
import { useState } from 'react'
import { useNotification } from '../../context/useNotification'

type FieldKey = 'username' | 'email' | 'numberPhone' | 'nationalId'

type Errors = Partial<Record<FieldKey, string>>

// Số điện thoại di động VN: bắt đầu bằng 0 hoặc +84, đầu số 3/5/7/8/9, tổng 10 số (không tính +84)
const PHONE_REGEX = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// CMND cũ: 9 số, CCCD mới: 12 số
const NATIONAL_ID_REGEX = /^(\d{9}|\d{12})$/

function validateField(key: FieldKey, rawValue: string): string {
  const value = rawValue.trim()

  switch (key) {
    case 'username':
      if (!value) return 'Vui lòng nhập tên người dùng'
      if (value.length < 3) return 'Tên người dùng phải có ít nhất 3 ký tự'
      if (value.length > 50) return 'Tên người dùng không được quá 50 ký tự'
      return ''

    case 'email':
      if (!value) return 'Vui lòng nhập email'
      if (!EMAIL_REGEX.test(value)) return 'Email không đúng định dạng'
      return ''

    case 'numberPhone':
      if (!value) return 'Vui lòng nhập số điện thoại'
      if (!PHONE_REGEX.test(value)) return 'Số điện thoại không hợp lệ (VD: 0912345678)'
      return ''

    case 'nationalId':
      // CCCD/CMND để trống vẫn được, chỉ validate khi người dùng có nhập
      if (!value) return ''
      if (!NATIONAL_ID_REGEX.test(value)) return 'CCCD/CMND phải gồm 9 hoặc 12 chữ số'
      return ''

    default:
      return ''
  }
}

export default function ProfileInfo() {
  const { customerData, setCustomerData } = useCustomer()

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { showNotification } = useNotification()
  const [username, setUsername] = useState(customerData?.username || '')
  const [email, setEmail] = useState(customerData?.email || '')
  const [numberPhone, setNumberPhone] = useState(customerData?.numberPhone || '')
  const [nationalId, setNationalId] = useState(customerData?.nationalId || '')
  const [errors, setErrors] = useState<Errors>({})

  const handleEditClick = () => {
    // Đảm bảo form luôn khởi động với dữ liệu mới nhất, tránh hiện giá trị cũ
    // từ lần chỉnh sửa trước nếu người dùng bấm Huỷ rồi bấm Sửa lại.
    setUsername(customerData?.username || '')
    setEmail(customerData?.email || '')
    setNumberPhone(customerData?.numberPhone || '')
    setNationalId(customerData?.nationalId || '')
    setErrors({})
    setIsEditing(true)
  }

  const handleCancel = () => {
    setUsername(customerData?.username || '')
    setEmail(customerData?.email || '')
    setNumberPhone(customerData?.numberPhone || '')
    setNationalId(customerData?.nationalId || '')
    setErrors({})
    setIsEditing(false)
  }

  const handleFieldChange = (key: FieldKey, value: string, setValue: (v: string) => void) => {
    setValue(value)
    setErrors((prev) => ({ ...prev, [key]: validateField(key, value) }))
  }

  const submitUpdate = async () => {
    const values: Record<FieldKey, string> = { username, email, numberPhone, nationalId }
    const nextErrors: Errors = {}
    for (const key of Object.keys(values) as FieldKey[]) {
      const message = validateField(key, values[key])
      if (message) nextErrors[key] = message
    }

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      showNotification({
        message: 'Vui lòng kiểm tra lại thông tin bạn vừa nhập',
        type: 'WARNING',
        duration: 3000,
      })
      return
    }

    setIsSaving(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8080/api/customers', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username,
          email,
          numberPhone,
          nationalId,
        }),
      })

      if (response.ok) {
        showNotification({
          message: 'Cập nhật thông tin cá nhân thành công',
          type: 'SUCCESS',
          duration: 3000,
        })
      } else {
        const errorData = await response.json()
        console.error('Error updating profile:', errorData)
        showNotification({
          message: `Cập nhật thất bại`,
          type: 'ERROR',
          duration: 3000,
        })
      }

      setCustomerData?.((prev) =>
        prev
          ? {
              ...prev,
              username,
              email,
              numberPhone,
              nationalId,
            }
          : prev
      )
      setIsEditing(false)
    } finally {
      setIsSaving(false)
    }
  }

  const fields: Array<{
    key: FieldKey
    label: string
    icon: React.ReactNode
    value: string
    setValue: (v: string) => void
    type: string
    display: string
  }> = [
    {
      key: 'username',
      label: 'Tên người dùng',
      icon: <UserCircle size={17} />,
      value: username,
      setValue: setUsername,
      type: 'text',
      display: customerData?.username || 'Chưa cập nhật',
    },
    {
      key: 'email',
      label: 'Tài khoản email',
      icon: <MailCheck size={17} />,
      value: email,
      setValue: setEmail,
      type: 'email',
      display: customerData?.email || 'Chưa cập nhật',
    },
    {
      key: 'numberPhone',
      label: 'Số điện thoại',
      icon: <Phone size={17} />,
      value: numberPhone,
      setValue: setNumberPhone,
      type: 'text',
      display: customerData?.numberPhone || 'Chưa cập nhật',
    },
    {
      key: 'nationalId',
      label: 'Số CCCD/CMND',
      icon: <IdCard size={17} />,
      value: nationalId,
      setValue: setNationalId,
      type: 'text',
      display: customerData?.nationalId || 'Chưa cập nhật',
    },
  ]

  const initials = (customerData?.username || '?').trim().charAt(0).toUpperCase()
  const hasErrors = Object.values(errors).some(Boolean)

  return (
    <div className="profileInfo">
      <header className="border-b border-green-100 pb-4 pt-2 px-3 mb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-linear-to-br from-emerald-400 to-teal-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shadow-emerald-200">
            {initials}
          </div>
          <div className="text-left">
            <h2 className="text-xl font-bold text-green-900">Thông tin cá nhân</h2>
            <p className="text-xs text-green-700/60">Quản lý thông tin tài khoản của bạn</p>
          </div>
        </div>

        {!isEditing ? (
          <button
            onClick={handleEditClick}
            className="flex items-center gap-1.5 text-sm font-semibold text-green-900 border border-green-200 rounded-xl px-3 py-2 hover:bg-green-50 hover:border-green-300 transition-colors"
          >
            <SquarePen size={16} />
            Chỉnh sửa
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="flex items-center gap-1.5 text-sm font-semibold text-green-900/70 rounded-xl px-3 py-2 hover:bg-green-50 transition-colors disabled:opacity-50"
            >
              <X size={16} />
              Huỷ
            </button>
            <button
              onClick={submitUpdate}
              disabled={isSaving || hasErrors}
              className="flex items-center gap-1.5 text-sm font-semibold text-white bg-linear-to-r from-emerald-500 to-teal-600 rounded-xl px-3.5 py-2 hover:from-emerald-600 hover:to-teal-700 transition-colors shadow-sm shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check size={16} />
              {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        )}
      </header>

      <main className="px-1">
        <div className="divide-y divide-green-50">
          {fields.map((field) => {
            const error = errors[field.key]

            return (
              <div key={field.key} className="flex items-start gap-3 py-4">
                <div
                  className={`w-9 h-9 shrink-0 rounded-xl flex items-center justify-center mt-0.5 transition-colors ${
                    error ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'
                  }`}
                >
                  {field.icon}
                </div>

                <div className="flex-1 text-left min-w-0">
                  <p className="text-xs font-semibold text-green-700/60 uppercase tracking-wide mb-1">
                    {field.label}
                  </p>

                  {isEditing ? (
                    <>
                      <input
                        type={field.type}
                        value={field.value}
                        placeholder={`Nhập ${field.label.toLowerCase()}`}
                        onChange={(e) =>
                          handleFieldChange(field.key, e.target.value, field.setValue)
                        }
                        aria-invalid={!!error}
                        className={`w-full bg-transparent border-0 border-b-2 px-0 py-1 text-green-900 font-medium focus:outline-none transition-colors ${
                          error
                            ? 'border-red-400 focus:border-red-500'
                            : 'border-green-200 focus:border-emerald-500'
                        }`}
                      />
                      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
                    </>
                  ) : (
                    <p className="text-green-900 font-medium truncate">{field.display}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-4 flex items-center justify-between rounded-2xl bg-linear-to-r from-emerald-50 to-teal-50 border border-emerald-100 px-4 py-3.5">
          <div className="flex items-center gap-2 text-green-900">
            <Leaf size={18} className="text-emerald-600" />
            <span className="font-semibold">Điểm tích lũy</span>
          </div>
          <span className="text-xl font-bold text-emerald-700">
            {customerData?.accumulatedEcoPoints || 0}
          </span>
        </div>
      </main>
    </div>
  )
}
