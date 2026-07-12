import { useEffect, useState } from 'react'
import type { Addressresponse } from '../model/address.model'
import { Plus, X } from 'lucide-react'
import AddressItem from './admin/AddressItem'
import AddNewAddress from './admin/AddNewAddress'
import UpdateAddress from './UpdateAddress'

export default function ProfileAddress() {
  const [addresses, setAddresses] = useState<Addressresponse[]>([])

  const token = localStorage.getItem('token')

  const [selectedAddress, setSelectedAddress] = useState<Addressresponse | null>(null)

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
  }, [token, addresses])

  const [showUpdateAddress, setShowUpdateAddress] = useState(false)

  const [showAddAddress, setShowAddAddress] = useState(false)

  return (
    <div className="profileAddress">
      <header className="border-b border-green-100 pb-4 pt-2 px-3 mb-4 text-left flex items-center justify-between">
        <h2 className="text-xl font-bold text-green-900">Quản lý địa chỉ giao nhận</h2>
      </header>

      <main className="addr_list grid-cols-2 gap-4 grid">
        {/* ADDRESSES LIST */}
        {addresses.length > 0 &&
          addresses.map((address) => (
            <AddressItem
              key={address.addressId}
              address={address}
              setShowUpdate={setShowUpdateAddress}
              setSelectedAddress={setSelectedAddress}
            />
          ))}
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
      {showAddAddress ? <AddNewAddress setShowAddAddress={setShowAddAddress} /> : null}

      {/* UPDATE ADDRESS MODAL */}
      {showUpdateAddress && selectedAddress ? (
        <UpdateAddress address={selectedAddress} setShowUpdateAddress={setShowUpdateAddress} />
      ) : null}
    </div>
  )
}
