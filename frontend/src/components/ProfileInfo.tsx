import { IdCard, Leaf, MailCheck, Phone, SquarePen, UserCircle } from 'lucide-react'
import { useCustomer } from '../context/useCustomer'
import { useState } from 'react'

export default function ProfileInfo() {
  const { customerData, setCustomerData } = useCustomer()

  const [isEditing, setIsEditing] = useState(false)

  const [username, setUsername] = useState(customerData?.username || '')
  const [email, setEmail] = useState(customerData?.email || '')
  const [numberPhone, setNumberPhone] = useState(customerData?.numberPhone || '')
  const [nationalId, setNationalId] = useState(customerData?.nationalId || '')

  const [dataUpdated, setDataUpdated] = useState({
    username: '',
    email: '',
    numberPhone: '',
    nationalId: '',
  })

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const submitUpdate = async () => {
    setIsEditing(false)

    setDataUpdated({
      username: username,
      email: email,
      numberPhone: numberPhone,
      nationalId: nationalId,
    })

    console.log('update data', dataUpdated)
  }

  console.log('customerData', customerData)

  return (
    <div className="profileInfo">
      <header className="border-b border-green-100 pb-4 pt-2 px-3 mb-4 text-left flex items-center justify-between">
        <h2 className="text-xl font-bold text-green-900">Thông tin cá nhân</h2>
        {!isEditing ? (
          <SquarePen
            onClick={handleEditClick}
            className="inline-block ml-2 text-green-900 hover:cursor-pointer"
            size={20}
          />
        ) : (
          <button
            className="text-white font-bold bg-blue-500 rounded-xl py-2 px-3 hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg"
            onClick={submitUpdate}
          >
            Lưu thay đổi
          </button>
        )}
      </header>
      <main className="px-3 py-2">
        <div className="text-lg flex items-center gap-2 text-green-900 pb-2">
          <div className="flex-2/5 text-left">
            <UserCircle className="inline-block mr-2" size={20} />
            <label htmlFor="" className="font-semibold ">
              Tên người dùng:
            </label>
          </div>
          <div className="flex-3/5 text-left">
            {isEditing ? (
              <input
                type="text"
                value={username}
                placeholder="Nhập tên người dùng"
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-400 rounded-xl px-2 py-1 text-green-900"
              />
            ) : (
              <p className="text-emerald-600">{customerData?.username}</p>
            )}
          </div>
        </div>

        <div className="text-lg flex items-center gap-2 text-green-900 pb-2">
          <div className="flex-2/5 text-left">
            <MailCheck className="inline-block mr-2" size={20} />
            <label htmlFor="" className="font-semibold ">
              Tài khoản email:
            </label>
          </div>
          <div className="flex-3/5 text-left">
            {isEditing ? (
              <input
                type="email"
                value={email}
                placeholder="Nhập email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-400 rounded-xl px-2 py-1 text-green-900"
              />
            ) : (
              <p className="text-emerald-600">{customerData?.email}</p>
            )}
          </div>
        </div>

        <div className="text-lg flex items-center gap-2 text-green-900 pb-2">
          <div className="flex-2/5 text-left">
            <Phone className="inline-block mr-2" size={20} />
            <label htmlFor="" className="font-semibold ">
              Số điện thoại:
            </label>
          </div>
          <div className="flex-3/5 text-left">
            {isEditing ? (
              <input
                type="text"
                value={numberPhone}
                placeholder="Nhập số điện thoại"
                onChange={(e) => setNumberPhone(e.target.value)}
                className="w-full border border-gray-400 rounded-xl px-2 py-1 text-green-900"
              />
            ) : (
              <p className="text-emerald-600">{customerData?.numberPhone}</p>
            )}
          </div>
        </div>

        <div className="text-lg flex items-center gap-2 text-green-900 pb-2">
          <div className="flex-2/5 text-left">
            <IdCard className="inline-block mr-2" size={20} />
            <label htmlFor="" className="font-semibold ">
              So CCCD/CMND:
            </label>
          </div>
          <div className="flex-3/5 text-left">
            {isEditing ? (
              <input
                type="text"
                value={nationalId}
                placeholder="Nhập số CCCD/CMND"
                onChange={(e) => setNationalId(e.target.value)}
                className="w-full border border-gray-400 rounded-xl px-2 py-1 text-green-900"
              />
            ) : (
              <p className="text-emerald-600">{dataUpdated?.nationalId || 'Chưa cập nhật'}</p>
            )}
          </div>
        </div>

        <div className="text-lg flex items-center gap-2 text-green-900 pb-2">
          <div className="flex-2/5 text-left">
            <Leaf className="inline-block mr-2" size={20} />
            <label htmlFor="" className="font-semibold ">
              Điểm tích lũy:
            </label>
          </div>

          <p className="text-left flex-3/5 text-emerald-600">
            {customerData?.accumulatedEcoPoints || 0}
          </p>
        </div>
      </main>
    </div>
  )
}
