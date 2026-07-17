import { MapPin, SquarePen } from 'lucide-react'
import type { Addressresponse } from '../../model/address.model'
import { useState } from 'react'

interface AddressItemProps {
  address: Addressresponse
  setShowUpdate: (value: boolean) => void
  setSelectedAddress: (address: Addressresponse) => void

  setSelectedAddressRemove: (address: Addressresponse) => void
}

export default function AddressItem({
  address,
  setShowUpdate,
  setSelectedAddress,
  setSelectedAddressRemove,
}: AddressItemProps) {
  const [showOptions, setShowOptions] = useState(false)

  const handleEditClick = () => {
    setSelectedAddress(address)
    setShowOptions(!showOptions)
  }

  return (
    <div
      onClick={() => setSelectedAddress(address)}
      className={`addrItem flex items-center justify-between p-3 border  rounded-2xl bg-white text-left ${address.isDefault ? 'border-emerald-600 shadow-xs shadow-emerald-50' : 'border-gray-400'}`}
    >
      <div className="">
        <div className="flex items-center">
          <MapPin className="inline-block mr-2 text-gray-400" size={20} />
          <h3 className="text-lg font-bold text-gray-800">{address.addressName}</h3>
          {address.isDefault ? (
            <p className="flex items-center ml-3 text-blue-500 text-xs font-semibold px-3 py-1 rounded-2xl bg-blue-100">
              Mặc định
            </p>
          ) : null}
        </div>
        <p className="text-gray-600">
          {address.addressStreet} , {address.villageName}, {address.cityName}{' '}
        </p>
      </div>
      <div className="p-3 relative">
        <SquarePen
          onClick={() => handleEditClick()}
          className="text-blue-600 hover:text-blue-900 transition-colors cursor-pointer"
          size={20}
        />

        {showOptions && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
            <button
              onClick={() => {
                setShowUpdate(true)
                setShowOptions(false)
              }}
              className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Chỉnh sửa
            </button>

            <button
              onClick={() => setSelectedAddressRemove(address)}
              className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Xóa địa chỉ
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
