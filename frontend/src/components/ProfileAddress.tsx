import { useEffect, useState } from 'react'
import type { Address } from '../model/address.model'
import { Plus, X } from 'lucide-react'
import AddressItem from './AddressItem'

export default function ProfileAddress() {
  const [addresses, setAddresses] = useState<Address[]>([])

  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/addresses', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setAddresses(data)
        }
      } catch (error) {
        console.error('Error fetching addresses:', error)
      }
    }

    if (token) {
      fetchAddresses()
    }
  }, [token])

  const fakeAddresses: Address = {
    addressId: 1,
    addressName: 'Nhà riêng',
    addressStreet: '123 Đường ABC',
    isDefault: true,
    villageId: 1,
    villageName: 'Phường 1',
    cityId: 1,
    cityName: 'TP. HCM',
  }

  const [showUpdateAddress, setShowUpdateAddress] = useState(false)

  const [showAddAddress, setShowAddAddress] = useState(false)

  const handleSubmitAddress = async () => {
    console.log('submit address')
  }
  return (
    <div className="profileAddress">
      <header className="border-b border-green-100 pb-4 pt-2 px-3 mb-4 text-left flex items-center justify-between">
        <h2 className="text-xl font-bold text-green-900">Quản lý địa chỉ giao nhận</h2>
      </header>

      <main className="addr_list grid-cols-2 gap-4 grid">
        {/* ADDRESSES LIST */}
        <AddressItem address={fakeAddresses} setShowUpdate={setShowUpdateAddress} />
        <AddressItem address={fakeAddresses} setShowUpdate={setShowUpdateAddress} />
        {/* DEAFAULT ADDRESS */}

        <div
          onClick={() => setShowAddAddress(true)}
          className="addrItem p-3 border border-gray-400 rounded-2xl bg-white hover:cursor-pointer hover:shadow-md transition-shadow"
        >
          <Plus className="inline-block mr-2 text-gray-300" size={25} />
          <h3 className="text-md font-semibold text-gray-300">Thêm địa chỉ</h3>
          <p className="text-gray-300 text-sm">Tạo địa chỉ giao nhận mới</p>
        </div>
      </main>

      {/* ADD ADDRESS MODAL */}
      {showAddAddress ? (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-300/70 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <h2 className="text-lg font-bold mb-4">Thêm địa chỉ mới</h2>
            <form onSubmit={handleSubmitAddress}>
              <div className="mb-4">
                <label htmlFor="addressName" className="block text-gray-700 font-semibold mb-2">
                  Tên địa chỉ
                </label>
                <input
                  type="text"
                  id="addressName"
                  name="addressName"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="addressStreet" className="block text-gray-700 font-semibold mb-2">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  id="addressStreet"
                  name="addressStreet"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
                />
              </div>
            </form>

            <X
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
              onClick={() => setShowAddAddress(false)}
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}
